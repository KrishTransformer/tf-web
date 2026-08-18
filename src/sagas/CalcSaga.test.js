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
    update: jest.fn(),
  },
}));

describe("addCalcData saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("routes multi-winding calculate requests to the dedicated backend and stores a typed design record", () => {
    const action = {
      jsonBody: { windingSelection: "5_WDG", kVA: 100 },
      calcName: "multiwindings",
      bodyType: "",
      id: "",
      metadata: {},
    };

    const generator = addCalcData(action);
    const response = { data: { selectedCode: "5_WDG", inputs: {}, results: {} } };

    expect(generator.next().value).toEqual(
      call(
        postApi,
        "/api/multiWdgCalculator/",
        action.jsonBody,
        { "X-Skip-Auth": "true" },
        {},
        "MULTI_WDG_SERVICE"
      )
    );

    const firstPutEffect = generator.next(response).value;
    const firstAction = firstPutEffect.payload.action;
    const designId = firstAction.metadata.designId;

    expect(firstAction.type).toBe("ADD_CALC_FULFILLED");
    expect(firstAction.response).toEqual(
      expect.objectContaining({
        windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
        calculationResponse: response.data,
        designId,
        designType: "multi",
      })
    );
    expect(firstAction.metadata).toEqual({ designId, entityId: "" });
    expect(designId).toMatch(/^100k-M/);

    const createEffect = generator.next().value;
    expect(createEffect.payload.fn).toBe(entityApi.create);
    expect(createEffect.payload.args[0]).toBe("design");
    expect(createEffect.payload.args[1].designId).toBe(designId);
    expect(createEffect.payload.args[1].designType).toBe("multi");
    expect(JSON.parse(createEffect.payload.args[1].multiWindings)).toEqual(
      expect.objectContaining({
        windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
        designId,
        designType: "multi",
      })
    );

    expect(generator.next({ data: { id: "multi-entity-1" } }).value).toEqual(
      put(
        addCalcFullfiled(
          "multiwindings",
          expect.objectContaining({
            windingConfiguration: "5_WDG_LV_HV_MAIN_CORSE_FINE_OUTER",
            calculationResponse: response.data,
            designId,
            designType: "multi",
          }),
          { designId, entityId: "multi-entity-1" }
        )
      )
    );

    expect(generator.next().value).toEqual(
      put(fetchEntity("design", "offset=0&size=100"))
    );

    expect(generator.next().done).toBe(true);
  });

  test("updates an existing multi-winding design when entity metadata is available", () => {
    const action = {
      jsonBody: { designId: "100k-M54321", windingSelection: "3_WDG", kVA: 100 },
      calcName: "multiwindings",
      bodyType: "",
      id: "",
      metadata: { designId: "100k-M54321", entityId: "entity-multi-9" },
    };

    const generator = addCalcData(action);
    const response = { data: { selectedCode: "3_WDG", inputs: {}, results: {} } };

    generator.next();
    const firstPutEffect = generator.next(response).value;
    expect(firstPutEffect).toEqual(
      put(
        addCalcFullfiled(
          "multiwindings",
          expect.objectContaining({
            designId: "100k-M54321",
            designType: "multi",
            windingConfiguration: "3_WDG_LV_HV_MAIN_OUTER",
          }),
          { designId: "100k-M54321", entityId: "entity-multi-9" }
        )
      )
    );

    const updateEffect = generator.next().value;
    expect(updateEffect.payload.fn).toBe(entityApi.update);
    expect(updateEffect.payload.args[0]).toBe("design");
    expect(updateEffect.payload.args[1]).toBe("entity-multi-9");
    expect(updateEffect.payload.args[2].designId).toBe("100k-M54321");
    expect(updateEffect.payload.args[2].designType).toBe("multi");
    expect(JSON.parse(updateEffect.payload.args[2].multiWindings)).toEqual(
      expect.objectContaining({
        designId: "100k-M54321",
        designType: "multi",
        windingConfiguration: "3_WDG_LV_HV_MAIN_OUTER",
      })
    );

    expect(generator.next({ data: { id: "entity-multi-9" } }).value).toEqual(
      put(fetchEntity("design", "offset=0&size=100"))
    );

    expect(generator.next().done).toBe(true);
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
        designType: "two",
        twoWindings: JSON.stringify({
          kVA: 100,
          turns: 55,
          designId,
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

  test("generates a fresh designId even for persisted designs", () => {
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
    const firstPutEffect = generator.next(calcResponse).value;
    const designId = firstPutEffect.payload.action.metadata.designId;

    expect(firstPutEffect.payload.action.response).toEqual({
      ...calcResponse.data,
      designId,
    });
    expect(firstPutEffect.payload.action.metadata).toEqual({ designId, entityId: "" });
    expect(designId).toMatch(/^400k-/);

    expect(generator.next().value).toEqual(
      call(entityApi.create, "design", {
        designId,
        designType: "two",
        twoWindings: JSON.stringify({
          kVA: 400,
          current: 22,
          designId,
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
