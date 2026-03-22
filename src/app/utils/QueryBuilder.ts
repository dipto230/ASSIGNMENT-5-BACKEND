/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IQueryConfig,
  IQueryParams,
  IQueryResult,
  PrismaCountArgs,
  PrismaFindManyArgs,
  PrismaModelDelegate,
  PrismaNumberFilter,
  PrismaStringFilter,
  PrismaWhereConditions,
} from "../interfaces/query.interface";

export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>,
  TInclude = Record<string, unknown>
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;
  private page = 1;
  private limit = 10;
  private skip = 0;
  private selectFields?: Record<string, boolean>;

  constructor(
    private model: PrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig = {}
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };
  }

  // 🔍 SEARCH
  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    if (searchTerm && searchableFields?.length) {
      const conditions = searchableFields.map((field) => {
        const stringFilter: PrismaStringFilter = {
          contains: searchTerm,
          mode: "insensitive",
        };

        if (field.includes(".")) {
          const parts = field.split(".");

          if (parts.length === 2) {
            const [relation, nested] = parts;

            return {
              [relation]: {
                [nested]: stringFilter,
              },
            };
          }

          if (parts.length === 3) {
            const [relation, nestedRelation, nested] = parts;

            return {
              [relation]: {
                some: {
                  [nestedRelation]: {
                    [nested]: stringFilter,
                  },
                },
              },
            };
          }
        }

        return {
          [field]: stringFilter,
        };
      });

      (this.query.where as PrismaWhereConditions).OR = conditions;
      (this.countQuery.where as PrismaWhereConditions).OR = conditions;
    }

    return this;
  }


  filter(): this {
    const excluded = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];

    const filters: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excluded.includes(key)) {
        filters[key] = this.queryParams[key];
      }
    });

    const where = this.query.where as Record<string, unknown>;
    const countWhere = this.countQuery.where as Record<string, unknown>;

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      // nested filter
      if (key.includes(".")) {
        const parts = key.split(".");

        if (parts.length === 2) {
          const [relation, field] = parts;

          where[relation] = {
            ...(where[relation] as object),
            [field]: this.parseValue(value),
          };

          countWhere[relation] = {
            ...(countWhere[relation] as object),
            [field]: this.parseValue(value),
          };
          return;
        }

        if (parts.length === 3) {
          const [relation, nestedRelation, field] = parts;

          where[relation] = {
            some: {
              [nestedRelation]: {
                [field]: this.parseValue(value),
              },
            },
          };

          countWhere[relation] = {
            some: {
              [nestedRelation]: {
                [field]: this.parseValue(value),
              },
            },
          };
          return;
        }
      }

      
      if (typeof value === "object") {
        where[key] = this.parseRange(value as Record<string,unknown>);
        countWhere[key] = this.parseRange(value as Record<string, unknown>);
        return;
      }

      where[key] = this.parseValue(value);
      countWhere[key] = this.parseValue(value);
    });

    return this;
  }


  paginate(): this {
    this.page = Number(this.queryParams.page) || 1;
    this.limit = Number(this.queryParams.limit) || 10;
    this.skip = (this.page - 1) * this.limit;

    this.query.skip = this.skip;
    this.query.take = this.limit;

    return this;
  }

  
  sort(): this {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";

    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");

      if (parts.length === 2) {
        const [relation, field] = parts;

        this.query.orderBy = {
          [relation]: {
            [field]: sortOrder,
          },
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder,
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder,
      };
    }

    return this;
  }

  
  fields(): this {
    const fields = this.queryParams.fields;

    if (fields) {
      const arr = fields.split(",");
      this.selectFields = {};

      arr.forEach((f) => {
        this.selectFields![f.trim()] = true;
      });

      this.query.select = this.selectFields;
      delete this.query.include;
    }

    return this;
  }

  // 🔗 INCLUDE
  include(relations: TInclude): this {
    if (!this.selectFields) {
      this.query.include = relations as Record<string, unknown>;
    }
    return this;
  }

  // 🔥 CUSTOM WHERE (TWhereInput use)
  where(condition: TWhereInput): this {
    this.query.where = {
      ...(this.query.where as Record<string, unknown>),
      ...(condition as Record<string, unknown>),
    };

    this.countQuery.where = {
      ...(this.countQuery.where as Record<string, unknown>),
      ...(condition as Record<string, unknown>),
    };

    return this;
  }

  // 🚀 EXECUTE
  async execute(): Promise<IQueryResult<T>> {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query),
    ]);

    return {
      data: data as T[],
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.ceil(total / this.limit),
      },
    };
  }

  // 🧠 HELPERS
  private parseValue(value: any) {
    if (value === "true") return true;
    if (value === "false") return false;

    if (!isNaN(value)) return Number(value);

    return value;
  }

  private parseRange(
    value: Record<string, any>
  ): PrismaNumberFilter | PrismaStringFilter {
    const result: Record<string, any> = {};

    Object.keys(value).forEach((op) => {
      const val = value[op];
      const parsed = isNaN(val) ? val : Number(val);

      switch (op) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
          result[op] = parsed;
          break;

        case "in":
        case "notIn":
          result[op] = Array.isArray(val) ? val : [parsed];
          break;
      }
    });

    return result;
  }
}