import { fetchEntity, fetchEntityFullfiled } from "../actions/EntityActions";
import entityReducer from "./EntityReducer";

describe("EntityReducer scoped result storage", () => {
  test("keeps differently filtered design-library responses separate", () => {
    let state = entityReducer(
      undefined,
      fetchEntity("design", "offset=0&size=20", {}, "designLibrary-all")
    );

    state = entityReducer(
      state,
      fetchEntityFullfiled({
        entityName: "designLibrary-all",
        data: { data: [{ id: "two-1" }], total: 21 },
      })
    );

    state = entityReducer(
      state,
      fetchEntity("design", "offset=0&size=20", {}, "designLibrary-multi")
    );
    state = entityReducer(
      state,
      fetchEntityFullfiled({
        entityName: "designLibrary-multi",
        data: { data: [{ id: "multi-1" }], total: 25 },
      })
    );

    expect(state.entity["designLibrary-all"].data.data).toEqual([{ id: "two-1" }]);
    expect(state.entity["designLibrary-all"].data.total).toBe(21);
    expect(state.entity["designLibrary-multi"].data.data).toEqual([{ id: "multi-1" }]);
    expect(state.entity["designLibrary-multi"].data.total).toBe(25);
  });
});
