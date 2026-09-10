import { fetchEntity, fetchEntityFullfiled } from "../actions/EntityActions";
import entityReducer from "./EntityReducer";

describe("EntityReducer category storage", () => {
  test("keeps 2Wdg and MWdg page results separate", () => {
    let state = entityReducer(
      undefined,
      fetchEntity("design", "offset=0&size=20", {}, "twoDesigns")
    );

    state = entityReducer(
      state,
      fetchEntityFullfiled({
        entityName: "twoDesigns",
        data: { data: [{ id: "two-1" }], total: 21 },
      })
    );

    state = entityReducer(
      state,
      fetchEntity("design", "offset=0&size=20", {}, "multiDesigns")
    );
    state = entityReducer(
      state,
      fetchEntityFullfiled({
        entityName: "multiDesigns",
        data: { data: [{ id: "multi-1" }], total: 25 },
      })
    );

    expect(state.entity.twoDesigns.data.data).toEqual([{ id: "two-1" }]);
    expect(state.entity.twoDesigns.data.total).toBe(21);
    expect(state.entity.multiDesigns.data.data).toEqual([{ id: "multi-1" }]);
    expect(state.entity.multiDesigns.data.total).toBe(25);
  });
});
