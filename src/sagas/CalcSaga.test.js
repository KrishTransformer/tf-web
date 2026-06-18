import { call, put } from "redux-saga/effects";
import { addCalcData } from "./CalcSaga";
import { addCalcFullfiled } from "../actions/CalcActions";
import { addEntityFailed, fetchEntity } from "../actions/EntityActions";
import { entityApi, postApi } from "../api";

jest.mock("../api", () => ({
  postApi: jest.fn(),
  putApi: jest.fn(),
  deleteApi: jest.fn(),
  getApi: jest.fn(),
  entityApi: {
    create: jest.fn(),
    list: jest.fn(),
  },
}));

describe("addCalcData saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generates a new designId for a new 2-winding design and stores returned entityId", () => {
    const action = {
      jsonBody: { kVA: 100 },
      calcName: "2windings",
      bodyType: "/circular",
      id: "",
      metadata: {},
    };

    const generator = addCalcData(action);
    const calcResponse = { data: { kVA: 100, turns: 55 } };

    expect(generator.next().value).toEqual(
      call(postApi, "/calculate/2windings/circular", action.jsonBody, {
        "User-Calc": true,
      })
    );

    const firstPutEffect = generator.next(calcResponse).value;
    const firstAction = firstPutEffect.payload.action;
    const designId = firstAction.metadata.designId;
    const updatedMetadata = { designId, entityId: "entity-1" };

    expect(firstAction.type).toBe("ADD_CALC_FULFILLED");
    expect(firstAction.response).toEqual({ ...calcResponse.data, designId });
    expect(firstAction.metadata).toEqual({ designId, entityId: "" });
    expect(designId).toMatch(/^100k-/);

    expect(generator.next().value).toEqual(
      call(entityApi.create, "design", {
        designId,
        twoWindings: JSON.stringify({
          kVA: 100,
          turns: 55,
        }),
      })
    );

    expect(generator.next({ data: { id: "entity-1" } }).value).toEqual(
      put(
        addCalcFullfiled("2windings", { ...calcResponse.data, designId }, updatedMetadata)
      )
    );

    expect(generator.next().value).toEqual(
      put(fetchEntity("design", "offset=0&size=100"))
    );

    expect(generator.next().done).toBe(true);
  });

  test("looks up the saved entity id when create response does not include it", () => {
    const action = {
      jsonBody: { kVA: 250 },
      calcName: "2windings",
      bodyType: "/circular",
      id: "",
      metadata: {},
    };

    const generator = addCalcData(action);
    const calcResponse = { data: { kVA: 250, loss: 12 } };

    generator.next();
    const firstPutEffect = generator.next(calcResponse).value;
    const designId = firstPutEffect.payload.action.metadata.designId;

    expect(firstPutEffect.payload.action.response).toEqual({
      ...calcResponse.data,
      designId,
    });
    expect(firstPutEffect.payload.action.metadata).toEqual({ designId, entityId: "" });
    expect(designId).toMatch(/^250k-/);

    generator.next();
    expect(generator.next({ data: { status: "ok" } }).value).toEqual(
      call(entityApi.list, "design", "offset=0&size=1", { designId: [designId] })
    );

    expect(generator.next({ data: { data: [{ id: "entity-lookup" }] } }).value).toEqual(
      put(
        addCalcFullfiled(
          "2windings",
          { ...calcResponse.data, designId },
          { designId, entityId: "entity-lookup" }
        )
      )
    );

    expect(generator.next().value).toEqual(
      put(fetchEntity("design", "offset=0&size=100"))
    );

    expect(generator.next().done).toBe(true);
  });

  test("keeps existing designId for persisted designs", () => {
    const action = {
      jsonBody: { kVA: 400 },
      calcName: "2windings",
      bodyType: "/circular",
      id: "entity-9",
      metadata: { designId: "400k-99999", entityId: "entity-9" },
    };

    const generator = addCalcData(action);
    const calcResponse = { data: { kVA: 400, current: 22 } };

    generator.next();
    expect(generator.next(calcResponse).value).toEqual(
      put(
        addCalcFullfiled(
          "2windings",
          { ...calcResponse.data, designId: "400k-99999" },
          { designId: "400k-99999", entityId: "entity-9" }
        )
      )
    );

    expect(generator.next().value).toEqual(
      call(entityApi.create, "design", {
        id: "entity-9",
        designId: "400k-99999",
        twoWindings: JSON.stringify({
          kVA: 400,
          current: 22,
        }),
      })
    );
  });

  test("marks design save failure if entity create response is missing data", () => {
    const action = {
      jsonBody: { kVA: 160 },
      calcName: "2windings",
      bodyType: "/circular",
      id: "",
      metadata: {},
    };

    const generator = addCalcData(action);
    const calcResponse = { data: { kVA: 160 } };

    generator.next();
    generator.next(calcResponse);
    generator.next();

    expect(generator.next(null).value).toEqual(put(addEntityFailed("design")));
  });
});
