import discountedItemsResolver from "./discountedItems";
import getFakeMongoCursor from "/imports/test-utils/helpers/getFakeMongoCursor";

const opaqueShopId = "cmVhY3Rpb24vc2hvcDoxMjM="; // reaction/shop:123
const opaqueTagId = "cmVhY3Rpb24vdGFnOjQ1Ng=="; // reaction/tag:456
const shopIds = [opaqueShopId];
const tagIds = [opaqueTagId];

const mockItems = [
  { _id: "a1", title: "Item 1" },
  { _id: "b2", title: "Item 2" },
  { _id: "c3", title: "Item 3" }
];

const mockItemsQuery = getFakeMongoCursor("Catalog", mockItems);

test("calls queries.discountedItems and returns a partial connection", async () => {
  const discountedItems = jest.fn().mockName("queries.discountedItems").mockReturnValueOnce(Promise.resolve(mockItemsQuery));

  const result = await discountedItemsResolver({}, {
    shopIds,
    tagIds
  }, {
    queries: { discountedItems }
  }, { fieldNodes: [] });

  expect(result).toEqual({
    nodes: mockItems,
    pageInfo: {
      endCursor: "c3",
      startCursor: "a1"
    },
    totalCount: null
  });

  expect(discountedItems).toHaveBeenCalled();
  expect(discountedItems.mock.calls[0][1]).toEqual({
    catalogBooleanFilters: {},
    shopIds: ["123"],
    tagIds: ["456"]
  });
});
