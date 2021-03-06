import { encodeAccountOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/account";
import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import updateAccountName from "./updateAccountName.js";

mockContext.mutations.updateAccountName = jest.fn().mockName("mutations.updateAccountName");

test("correctly passes through to internal mutation function", async () => {
  const accountId = encodeAccountOpaqueId("1");
  const firstName = "Test";
  const lastName = "Name";

  const fakeResult = { _id: "1", profile: { name: "Test Name", firstName: "Test", lastName: "Name" } };

  mockContext.mutations.updateAccountName.mockReturnValueOnce(Promise.resolve(fakeResult));

  const result = await updateAccountName(null, {
    input: {
      accountId,
      firstName,
      lastName,
      clientMutationId: "clientMutationId"
    }
  }, mockContext);

  expect(mockContext.mutations.updateAccountName).toHaveBeenCalledWith(
    mockContext,
    { accountId: "1", firstName: "Test", lastName: "Name" }
  );

  expect(result).toEqual({
    account: fakeResult,
    clientMutationId: "clientMutationId"
  });
});
