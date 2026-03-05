import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      // TODO: swagger.json url로 변경 필요
      target: "swagger.json",
      override: {
        transformer: (spec) => {
          // 제외할 tag
          const excludeTags = ["health-controller"];

          // 제외할 operationId
          const excludeOperationIds: string[] = [];

          Object.values(spec.paths || {}).forEach((path: any) => {
            Object.keys(path).forEach((method) => {
              const operation = path[method];
              const shoudExcludeById = excludeOperationIds.includes(
                operation.operationId,
              );
              const shouldExcludeByTag = operation.tags?.some((tag: string) =>
                excludeTags.includes(tag),
              );

              if (shouldExcludeByTag || shoudExcludeById) {
                delete path[method];
              }
            });
          });

          return spec;
        },
      },
    },
    output: {
      mode: "tags-split", // 태그별로 파일 분리
      target: "src/api",
      schemas: "src/api/model",
      client: "react-query",
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: "src/lib/mutator.ts",
          name: "customMutator",
        },
        query: {
          useQuery: true,
        },

        operations: {
          // 무한 스크롤, 페이지 파라미터가 필요한 operationId는 여기서 설정.
          getComments: {
            query: {
              useInfinite: true, // 무한 스크롤
              useInfiniteQueryParam: "page", // 페이지 파라미터
            },
          },
          getVideosByTag: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "page",
            },
          },
        },
      },
    },
  },
});
