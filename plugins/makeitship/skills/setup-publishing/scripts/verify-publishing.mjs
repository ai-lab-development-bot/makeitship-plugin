#!/usr/bin/env node
// Generated from makeitship-dashboard 2ba83f34 (supabase/functions/_shared/publish-readiness/cli-main.ts) — do not edit; rebuild with npm run build:verify-publishing.
// supabase/functions/_shared/publish-readiness/cli-main.ts
import { execFile } from "node:child_process";
import process from "node:process";

// supabase/functions/_shared/publish-readiness/cli.ts
import { join as join2 } from "node:path";

// supabase/functions/_shared/mcp-contract/publish-readiness.ts
var NON_BLOCKING_ITEMS = [
  "protection",
  "rollback_ready"
];
var READINESS_HOSTS = [
  "vercel",
  "netlify",
  "cloudflare"
];
var SHARED_WORKFLOWS_REPO = "ai-lab-development-bot/makeitship-actions";
var SUPPORTED_SHARED_MAJORS = [
  "v1"
];
var TEST_DEPLOY_TIMEOUT_MS = 20 * 6e4;

// deno:https://jsr.io/@std/yaml/1.3.0/_chars.ts
var TAB = 9;
var LINE_FEED = 10;
var CARRIAGE_RETURN = 13;
var SPACE = 32;
var EXCLAMATION = 33;
var DOUBLE_QUOTE = 34;
var SHARP = 35;
var PERCENT = 37;
var AMPERSAND = 38;
var SINGLE_QUOTE = 39;
var ASTERISK = 42;
var PLUS = 43;
var COMMA = 44;
var MINUS = 45;
var DOT = 46;
var COLON = 58;
var SMALLER_THAN = 60;
var GREATER_THAN = 62;
var QUESTION = 63;
var COMMERCIAL_AT = 64;
var LEFT_SQUARE_BRACKET = 91;
var BACKSLASH = 92;
var RIGHT_SQUARE_BRACKET = 93;
var GRAVE_ACCENT = 96;
var LEFT_CURLY_BRACKET = 123;
var VERTICAL_LINE = 124;
var RIGHT_CURLY_BRACKET = 125;
function isEOL(c) {
  return c === LINE_FEED || c === CARRIAGE_RETURN;
}
function isWhiteSpace(c) {
  return c === TAB || c === SPACE;
}
function isWhiteSpaceOrEOL(c) {
  return isWhiteSpace(c) || isEOL(c);
}
function isFlowIndicator(c) {
  return c === COMMA || c === LEFT_SQUARE_BRACKET || c === RIGHT_SQUARE_BRACKET || c === LEFT_CURLY_BRACKET || c === RIGHT_CURLY_BRACKET;
}

// deno:https://jsr.io/@std/yaml/1.3.0/_type/binary.ts
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  let code2;
  let bitlen = 0;
  const max = data.length;
  const map3 = BASE64_MAP;
  for (let idx = 0; idx < max; idx++) {
    code2 = map3.indexOf(data.charAt(idx));
    if (code2 > 64) continue;
    if (code2 < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  const input = data.replace(/[\r\n=]/g, "");
  const max = input.length;
  const map3 = BASE64_MAP;
  const result = [];
  let bits = 0;
  for (let idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map3.indexOf(input.charAt(idx));
  }
  const tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  const max = object.length;
  const map3 = BASE64_MAP;
  let result = "";
  let bits = 0;
  for (let idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map3[bits >> 18 & 63];
      result += map3[bits >> 12 & 63];
      result += map3[bits >> 6 & 63];
      result += map3[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  const tail = max % 3;
  if (tail === 0) {
    result += map3[bits >> 18 & 63];
    result += map3[bits >> 12 & 63];
    result += map3[bits >> 6 & 63];
    result += map3[bits & 63];
  } else if (tail === 2) {
    result += map3[bits >> 10 & 63];
    result += map3[bits >> 4 & 63];
    result += map3[bits << 2 & 63];
    result += map3[64];
  } else if (tail === 1) {
    result += map3[bits >> 2 & 63];
    result += map3[bits << 4 & 63];
    result += map3[64];
    result += map3[64];
  }
  return result;
}
function isBinary(obj) {
  return obj instanceof Uint8Array;
}
var binary = {
  tag: "tag:yaml.org,2002:binary",
  construct: constructYamlBinary,
  kind: "scalar",
  predicate: isBinary,
  represent: representYamlBinary,
  resolve: resolveYamlBinary
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/bool.ts
var YAML_TRUE_BOOLEANS = [
  "true",
  "True",
  "TRUE"
];
var YAML_FALSE_BOOLEANS = [
  "false",
  "False",
  "FALSE"
];
var YAML_BOOLEANS = [
  ...YAML_TRUE_BOOLEANS,
  ...YAML_FALSE_BOOLEANS
];
var bool = {
  tag: "tag:yaml.org,2002:bool",
  kind: "scalar",
  defaultStyle: "lowercase",
  predicate: (value) => typeof value === "boolean" || value instanceof Boolean,
  construct: (data) => YAML_TRUE_BOOLEANS.includes(data),
  resolve: (data) => YAML_BOOLEANS.includes(data),
  represent: {
    // deno-lint-ignore ban-types
    lowercase: (object) => {
      const value = object instanceof Boolean ? object.valueOf() : object;
      return value ? "true" : "false";
    },
    // deno-lint-ignore ban-types
    uppercase: (object) => {
      const value = object instanceof Boolean ? object.valueOf() : object;
      return value ? "TRUE" : "FALSE";
    },
    // deno-lint-ignore ban-types
    camelcase: (object) => {
      const value = object instanceof Boolean ? object.valueOf() : object;
      return value ? "True" : "False";
    }
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_utils.ts
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isNegativeZero(i) {
  return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
}
function isPlainObject(object) {
  return Object.prototype.toString.call(object) === "[object Object]";
}

// deno:https://jsr.io/@std/yaml/1.3.0/_type/float.ts
var YAML_FLOAT_REGEXP = new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
  if (!YAML_FLOAT_REGEXP.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  let value = data.replace(/_/g, "").toLowerCase();
  const sign = value[0] === "-" ? -1 : 1;
  if (value[0] && "+-".includes(value[0])) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }
  if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value);
}
var SCIENTIFIC_WITHOUT_DOT_REGEXP = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  const value = object instanceof Number ? object.valueOf() : object;
  if (isNaN(value)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === value) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === value) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (isNegativeZero(value)) {
    return "-0.0";
  }
  const res = value.toString(10);
  return SCIENTIFIC_WITHOUT_DOT_REGEXP.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  if (object instanceof Number) object = object.valueOf();
  return typeof object === "number" && (object % 1 !== 0 || isNegativeZero(object));
}
var float = {
  tag: "tag:yaml.org,2002:float",
  construct: constructYamlFloat,
  defaultStyle: "lowercase",
  kind: "scalar",
  predicate: isFloat,
  represent: representYamlFloat,
  resolve: resolveYamlFloat
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/int.ts
function isCharCodeInRange(c, lower, upper) {
  return lower <= c && c <= upper;
}
function isHexCode(c) {
  return isCharCodeInRange(c, 48, 57) || // 0-9
  isCharCodeInRange(c, 65, 70) || // A-F
  isCharCodeInRange(c, 97, 102);
}
function isOctCode(c) {
  return isCharCodeInRange(c, 48, 55);
}
function isDecCode(c) {
  return isCharCodeInRange(c, 48, 57);
}
function resolveYamlInteger(data) {
  const max = data.length;
  let index = 0;
  let hasDigits = false;
  if (!max) return false;
  let ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_") continue;
      if (!isOctCode(data.charCodeAt(index))) return false;
      hasDigits = true;
    }
    return hasDigits && ch !== "_";
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}
function constructYamlInteger(data) {
  let value = data;
  if (value.includes("_")) {
    value = value.replace(/_/g, "");
  }
  let sign = 1;
  let ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  if (object instanceof Number) object = object.valueOf();
  return typeof object === "number" && object % 1 === 0 && !isNegativeZero(object);
}
var int = {
  tag: "tag:yaml.org,2002:int",
  construct: constructYamlInteger,
  defaultStyle: "decimal",
  kind: "scalar",
  predicate: isInteger,
  represent: {
    // deno-lint-ignore ban-types
    binary(object) {
      const value = object instanceof Number ? object.valueOf() : object;
      return value >= 0 ? `0b${value.toString(2)}` : `-0b${value.toString(2).slice(1)}`;
    },
    // deno-lint-ignore ban-types
    octal(object) {
      const value = object instanceof Number ? object.valueOf() : object;
      return value >= 0 ? `0${value.toString(8)}` : `-0${value.toString(8).slice(1)}`;
    },
    // deno-lint-ignore ban-types
    decimal(object) {
      const value = object instanceof Number ? object.valueOf() : object;
      return value.toString(10);
    },
    // deno-lint-ignore ban-types
    hexadecimal(object) {
      const value = object instanceof Number ? object.valueOf() : object;
      return value >= 0 ? `0x${value.toString(16).toUpperCase()}` : `-0x${value.toString(16).toUpperCase().slice(1)}`;
    }
  },
  resolve: resolveYamlInteger
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/map.ts
var map = {
  tag: "tag:yaml.org,2002:map",
  resolve() {
    return true;
  },
  construct(data) {
    return data !== null ? data : {};
  },
  kind: "mapping"
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/merge.ts
var merge = {
  tag: "tag:yaml.org,2002:merge",
  kind: "scalar",
  resolve: (data) => data === "<<" || data === null,
  construct: (data) => data
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/nil.ts
var nil = {
  tag: "tag:yaml.org,2002:null",
  kind: "scalar",
  defaultStyle: "lowercase",
  predicate: (object) => object === null,
  construct: () => null,
  resolve: (data) => {
    return data === "~" || data === "null" || data === "Null" || data === "NULL";
  },
  represent: {
    lowercase: () => "null",
    uppercase: () => "NULL",
    camelcase: () => "Null"
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/omap.ts
function resolveYamlOmap(data) {
  const objectKeys = /* @__PURE__ */ new Set();
  for (const object of data) {
    if (!isPlainObject(object)) return false;
    const keys = Object.keys(object);
    if (keys.length !== 1) return false;
    for (const key of keys) {
      if (objectKeys.has(key)) return false;
      objectKeys.add(key);
    }
  }
  return true;
}
var omap = {
  tag: "tag:yaml.org,2002:omap",
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct(data) {
    return data;
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/pairs.ts
function resolveYamlPairs(data) {
  if (data === null) return true;
  return data.every((it) => isPlainObject(it) && Object.keys(it).length === 1);
}
var pairs = {
  tag: "tag:yaml.org,2002:pairs",
  construct(data) {
    return data?.flatMap(Object.entries) ?? [];
  },
  kind: "sequence",
  resolve: resolveYamlPairs
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/regexp.ts
var REGEXP = /^\/(?<regexp>[\s\S]+)\/(?<modifiers>[gismuy]*)$/;
var regexp = {
  tag: "tag:yaml.org,2002:js/regexp",
  kind: "scalar",
  resolve(data) {
    if (data === null || !data.length) return false;
    if (data.charAt(0) === "/") {
      const groups = data.match(REGEXP)?.groups;
      if (!groups) return false;
      const modifiers = groups.modifiers ?? "";
      if (new Set(modifiers).size < modifiers.length) return false;
    }
    return true;
  },
  construct(data) {
    const { regexp: regexp2 = data, modifiers = "" } = data.match(REGEXP)?.groups ?? {};
    return new RegExp(regexp2, modifiers);
  },
  predicate: (object) => object instanceof RegExp,
  represent: (object) => object.toString()
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/seq.ts
var seq = {
  tag: "tag:yaml.org,2002:seq",
  kind: "sequence",
  resolve: () => true,
  construct: (data) => data !== null ? data : []
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/set.ts
var set = {
  tag: "tag:yaml.org,2002:set",
  kind: "mapping",
  construct: (data) => data !== null ? data : {},
  resolve: (data) => {
    if (data === null) return true;
    return Object.values(data).every((it) => it === null);
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/str.ts
var str = {
  tag: "tag:yaml.org,2002:str",
  kind: "scalar",
  resolve: () => true,
  construct: (data) => data !== null ? data : ""
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/timestamp.ts
var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  let match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) {
    throw new Error("Cannot construct YAML timestamp: date resolve error");
  }
  const year = +match[1];
  const month = +match[2] - 1;
  const day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  const hour = +match[4];
  const minute = +match[5];
  const second = +match[6];
  let fraction = 0;
  if (match[7]) {
    let partFraction = match[7].slice(0, 3);
    while (partFraction.length < 3) {
      partFraction += "0";
    }
    fraction = +partFraction;
  }
  let delta = null;
  if (match[9] && match[10]) {
    const tzHour = +match[10];
    const tzMinute = +(match[11] || 0);
    delta = (tzHour * 60 + tzMinute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  const date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(date) {
  return date.toISOString();
}
var timestamp = {
  tag: "tag:yaml.org,2002:timestamp",
  construct: constructYamlTimestamp,
  predicate(object) {
    return object instanceof Date;
  },
  kind: "scalar",
  represent: representYamlTimestamp,
  resolve: resolveYamlTimestamp
};

// deno:https://jsr.io/@std/yaml/1.3.0/_type/undefined.ts
var undefinedType = {
  tag: "tag:yaml.org,2002:js/undefined",
  kind: "scalar",
  resolve() {
    return true;
  },
  construct() {
    return void 0;
  },
  predicate(object) {
    return typeof object === "undefined";
  },
  represent() {
    return "";
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_schema.ts
function createTypeMap(implicitTypes, explicitTypes) {
  const result = {
    fallback: /* @__PURE__ */ new Map(),
    mapping: /* @__PURE__ */ new Map(),
    scalar: /* @__PURE__ */ new Map(),
    sequence: /* @__PURE__ */ new Map()
  };
  const fallbackMap = result.fallback;
  for (const type of [
    ...implicitTypes,
    ...explicitTypes
  ]) {
    const map3 = result[type.kind];
    map3.set(type.tag, type);
    fallbackMap.set(type.tag, type);
  }
  return result;
}
function createSchema({ explicitTypes = [], implicitTypes = [], include }) {
  if (include) {
    implicitTypes.push(...include.implicitTypes);
    explicitTypes.push(...include.explicitTypes);
  }
  const typeMap = createTypeMap(implicitTypes, explicitTypes);
  return {
    implicitTypes,
    explicitTypes,
    typeMap
  };
}
var FAILSAFE_SCHEMA = createSchema({
  explicitTypes: [
    str,
    seq,
    map
  ]
});
var JSON_SCHEMA = createSchema({
  implicitTypes: [
    nil,
    bool,
    int,
    float
  ],
  include: FAILSAFE_SCHEMA
});
var CORE_SCHEMA = createSchema({
  include: JSON_SCHEMA
});
var DEFAULT_SCHEMA = createSchema({
  explicitTypes: [
    binary,
    omap,
    pairs,
    set
  ],
  implicitTypes: [
    timestamp,
    merge
  ],
  include: CORE_SCHEMA
});
var EXTENDED_SCHEMA = createSchema({
  explicitTypes: [
    regexp,
    undefinedType
  ],
  include: DEFAULT_SCHEMA
});
var SCHEMA_MAP = /* @__PURE__ */ new Map([
  [
    "core",
    CORE_SCHEMA
  ],
  [
    "default",
    DEFAULT_SCHEMA
  ],
  [
    "failsafe",
    FAILSAFE_SCHEMA
  ],
  [
    "json",
    JSON_SCHEMA
  ],
  [
    "extended",
    EXTENDED_SCHEMA
  ]
]);

// deno:https://jsr.io/@std/yaml/1.3.0/types.ts
var YamlSyntaxError = class extends SyntaxError {
  /**
   * The line number where the error occurred (1-indexed).
   *
   * @example Usage
   * ```ts
   * import { YamlSyntaxError } from "@std/yaml";
   * import { assertEquals } from "@std/assert";
   *
   * const error = new YamlSyntaxError("Test", { line: 5, column: 10, offset: 50 });
   * assertEquals(error.line, 5);
   * ```
   */
  line;
  /**
   * The column number where the error occurred (1-indexed).
   *
   * @example Usage
   * ```ts
   * import { YamlSyntaxError } from "@std/yaml";
   * import { assertEquals } from "@std/assert";
   *
   * const error = new YamlSyntaxError("Test", { line: 5, column: 10, offset: 50 });
   * assertEquals(error.column, 10);
   * ```
   */
  column;
  /**
   * The character offset where the error occurred (0-indexed).
   *
   * @example Usage
   * ```ts
   * import { YamlSyntaxError } from "@std/yaml";
   * import { assertEquals } from "@std/assert";
   *
   * const error = new YamlSyntaxError("Test", { line: 5, column: 10, offset: 50 });
   * assertEquals(error.offset, 50);
   * ```
   */
  offset;
  /**
   * A formatted snippet of the source around the error, including a caret
   * line indicating the column. Undefined when the source is empty.
   *
   * @example Usage
   * ```ts
   * import { YamlSyntaxError } from "@std/yaml";
   * import { assertEquals } from "@std/assert";
   *
   * const snippet = "    foo: bar\n         ^";
   * const error = new YamlSyntaxError(
   *   "Test",
   *   { line: 1, column: 6, offset: 5 },
   *   snippet,
   * );
   * assertEquals(error.snippet, snippet);
   * ```
   */
  snippet;
  /**
   * Constructs a new YamlSyntaxError.
   *
   * The constructed `message` is `${message} at line ${line}, column ${column}`,
   * with `:\n${snippet}` appended when a snippet is provided.
   *
   * @param message The error message describing the syntax issue.
   * @param position The position in the YAML source where the error occurred.
   * @param snippet Optional formatted snippet of the source around the error.
   */
  constructor(message, position, snippet) {
    let fullMessage = `${message} at line ${position.line}, column ${position.column}`;
    if (snippet) fullMessage += `:
${snippet}`;
    super(fullMessage);
    this.name = "YamlSyntaxError";
    this.line = position.line;
    this.column = position.column;
    this.offset = position.offset;
    if (snippet !== void 0) this.snippet = snippet;
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/_loader_state.ts
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE_REGEXP = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS_REGEXP = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS_REGEXP = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE_REGEXP = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI_REGEXP = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
var ESCAPED_HEX_LENGTHS = /* @__PURE__ */ new Map([
  [
    120,
    2
  ],
  [
    117,
    4
  ],
  [
    85,
    8
  ]
]);
var SIMPLE_ESCAPE_SEQUENCES = /* @__PURE__ */ new Map([
  [
    48,
    "\0"
  ],
  [
    97,
    "\x07"
  ],
  [
    98,
    "\b"
  ],
  [
    116,
    "	"
  ],
  [
    9,
    "	"
  ],
  [
    110,
    "\n"
  ],
  [
    118,
    "\v"
  ],
  [
    102,
    "\f"
  ],
  [
    114,
    "\r"
  ],
  [
    101,
    "\x1B"
  ],
  [
    32,
    " "
  ],
  [
    34,
    '"'
  ],
  [
    47,
    "/"
  ],
  [
    92,
    "\\"
  ],
  [
    78,
    "\x85"
  ],
  [
    95,
    "\xA0"
  ],
  [
    76,
    "\u2028"
  ],
  [
    80,
    "\u2029"
  ]
]);
function hexCharCodeToNumber(charCode) {
  if (48 <= charCode && charCode <= 57) return charCode - 48;
  const lc = charCode | 32;
  if (97 <= lc && lc <= 102) return lc - 97 + 10;
  return -1;
}
function decimalCharCodeToNumber(charCode) {
  if (48 <= charCode && charCode <= 57) return charCode - 48;
  return -1;
}
function codepointToChar(codepoint) {
  if (codepoint <= 65535) return String.fromCharCode(codepoint);
  return String.fromCharCode((codepoint - 65536 >> 10) + 55296, (codepoint - 65536 & 1023) + 56320);
}
var INDENT = 4;
var MAX_LENGTH = 75;
var DELIMITERS = "\0\r\n\x85\u2028\u2029";
function getSnippet(buffer, position) {
  if (!buffer) return null;
  let start = position;
  let end = position;
  let head = "";
  let tail = "";
  while (start > 0 && !DELIMITERS.includes(buffer.charAt(start - 1))) {
    start--;
    if (position - start > MAX_LENGTH / 2 - 1) {
      head = " ... ";
      start += 5;
      break;
    }
  }
  while (end < buffer.length && !DELIMITERS.includes(buffer.charAt(end))) {
    end++;
    if (end - position > MAX_LENGTH / 2 - 1) {
      tail = " ... ";
      end -= 5;
      break;
    }
  }
  const snippet = buffer.slice(start, end);
  const indent = " ".repeat(INDENT);
  const caretIndent = " ".repeat(INDENT + position - start + head.length);
  return `${indent + head + snippet + tail}
${caretIndent}^`;
}
function getIndentStatus(lineIndent, parentIndent) {
  if (lineIndent > parentIndent) return 1;
  if (lineIndent < parentIndent) return -1;
  return 0;
}
function writeFoldedLines(count) {
  if (count === 1) return " ";
  if (count > 1) return "\n".repeat(count - 1);
  return "";
}
var Scanner = class {
  source;
  #length;
  position = 0;
  constructor(source) {
    source += "\0";
    this.source = source;
    this.#length = source.length;
  }
  peek(offset = 0) {
    return this.source.charCodeAt(this.position + offset);
  }
  next() {
    this.position += 1;
  }
  eof() {
    return this.position >= this.#length - 1;
  }
};
var LoaderState = class {
  #scanner;
  lineIndent = 0;
  lineStart = 0;
  line = 0;
  onWarning;
  allowDuplicateKeys;
  implicitTypes;
  typeMap;
  checkLineBreaks = false;
  tagMap = /* @__PURE__ */ new Map();
  anchorMap = /* @__PURE__ */ new Map();
  constructor(input, { schema = DEFAULT_SCHEMA, onWarning, allowDuplicateKeys = false }) {
    this.#scanner = new Scanner(input);
    this.onWarning = onWarning;
    this.allowDuplicateKeys = allowDuplicateKeys;
    this.implicitTypes = schema.implicitTypes;
    this.typeMap = schema.typeMap;
    this.readIndent();
  }
  skipWhitespaces() {
    let ch = this.#scanner.peek();
    while (isWhiteSpace(ch)) {
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
  }
  skipComment() {
    let ch = this.#scanner.peek();
    if (ch !== SHARP) return;
    this.#scanner.next();
    ch = this.#scanner.peek();
    while (ch !== 0 && !isEOL(ch)) {
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
  }
  readIndent() {
    let ch = this.#scanner.peek();
    while (ch === SPACE) {
      this.lineIndent += 1;
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
  }
  #createError(message) {
    const offset = this.#scanner.position;
    const snippet = getSnippet(this.#scanner.source, offset) ?? void 0;
    return new YamlSyntaxError(message, {
      line: this.line + 1,
      column: offset - this.lineStart + 1,
      offset
    }, snippet);
  }
  dispatchWarning(message) {
    const error = this.#createError(message);
    this.onWarning?.(error);
  }
  yamlDirectiveHandler(args) {
    if (args.length !== 1) {
      throw this.#createError("Cannot handle YAML directive: YAML directive accepts exactly one argument");
    }
    const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throw this.#createError("Cannot handle YAML directive: ill-formed argument");
    }
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    if (major !== 1) {
      throw this.#createError("Cannot handle YAML directive: unacceptable YAML version");
    }
    this.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      this.dispatchWarning("Cannot handle YAML directive: unsupported YAML version");
    }
    return args[0] ?? null;
  }
  tagDirectiveHandler(args) {
    if (args.length !== 2) {
      throw this.#createError(`Cannot handle tag directive: directive accepts exactly two arguments, received ${args.length}`);
    }
    const handle = args[0];
    const prefix = args[1];
    if (!PATTERN_TAG_HANDLE_REGEXP.test(handle)) {
      throw this.#createError(`Cannot handle tag directive: ill-formed handle (first argument) in "${handle}"`);
    }
    if (this.tagMap.has(handle)) {
      throw this.#createError(`Cannot handle tag directive: previously declared suffix for "${handle}" tag handle`);
    }
    if (!PATTERN_TAG_URI_REGEXP.test(prefix)) {
      throw this.#createError("Cannot handle tag directive: ill-formed tag prefix (second argument) of the TAG directive");
    }
    this.tagMap.set(handle, prefix);
  }
  captureSegment(start, end, checkJson) {
    if (start < end) {
      const result = this.#scanner.source.slice(start, end);
      if (checkJson) {
        for (let position = 0; position < result.length; position++) {
          const character = result.charCodeAt(position);
          if (!(character === 9 || 32 <= character && character <= 1114111)) {
            throw this.#createError(`Expected valid JSON character: received "${character}"`);
          }
        }
      } else if (PATTERN_NON_PRINTABLE_REGEXP.test(result)) {
        throw this.#createError("Stream contains non-printable characters");
      }
      return result;
    }
  }
  readBlockSequence(tag, anchor, nodeIndent) {
    let detected = false;
    const result = [];
    if (anchor !== null) this.anchorMap.set(anchor, result);
    let ch = this.#scanner.peek();
    while (ch !== 0) {
      if (ch !== MINUS) {
        break;
      }
      const following = this.#scanner.peek(1);
      if (!isWhiteSpaceOrEOL(following)) {
        break;
      }
      detected = true;
      this.#scanner.next();
      if (this.skipSeparationSpace(true, -1)) {
        if (this.lineIndent <= nodeIndent) {
          result.push(null);
          ch = this.#scanner.peek();
          continue;
        }
      }
      const line = this.line;
      const newState = this.composeNode({
        parentIndent: nodeIndent,
        nodeContext: CONTEXT_BLOCK_IN,
        allowToSeek: false,
        allowCompact: true
      });
      if (newState) result.push(newState.result);
      this.skipSeparationSpace(true, -1);
      ch = this.#scanner.peek();
      if ((this.line === line || this.lineIndent > nodeIndent) && ch !== 0) {
        throw this.#createError("Cannot read block sequence: bad indentation of a sequence entry");
      } else if (this.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) return {
      tag,
      anchor,
      kind: "sequence",
      result
    };
  }
  mergeMappings(destination, source, overridableKeys) {
    if (!isObject(source)) {
      throw this.#createError("Cannot merge mappings: the provided source object is unacceptable");
    }
    for (const [key, value] of Object.entries(source)) {
      if (Object.hasOwn(destination, key)) continue;
      if (key === "__proto__") {
        Object.defineProperty(destination, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      } else {
        destination[key] = value;
      }
      overridableKeys.add(key);
    }
  }
  storeMappingPair(result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (let index = 0; index < keyNode.length; index++) {
        if (Array.isArray(keyNode[index])) {
          throw this.#createError("Cannot store mapping pair: nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && isPlainObject(keyNode[index])) {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && isPlainObject(keyNode)) {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (let index = 0; index < valueNode.length; index++) {
          this.mergeMappings(result, valueNode[index], overridableKeys);
        }
      } else {
        this.mergeMappings(result, valueNode, overridableKeys);
      }
    } else {
      if (!this.allowDuplicateKeys && !overridableKeys.has(keyNode) && Object.hasOwn(result, keyNode)) {
        this.line = startLine || this.line;
        this.#scanner.position = startPos || this.#scanner.position;
        throw this.#createError("Cannot store mapping pair: duplicated key");
      }
      if (keyNode === "__proto__") {
        Object.defineProperty(result, keyNode, {
          value: valueNode,
          writable: true,
          enumerable: true,
          configurable: true
        });
      } else {
        result[keyNode] = valueNode;
      }
      overridableKeys.delete(keyNode);
    }
    return result;
  }
  readLineBreak() {
    const ch = this.#scanner.peek();
    if (ch === LINE_FEED) {
      this.#scanner.next();
    } else if (ch === CARRIAGE_RETURN) {
      this.#scanner.next();
      if (this.#scanner.peek() === LINE_FEED) {
        this.#scanner.next();
      }
    } else {
      throw this.#createError("Cannot read line: line break not found");
    }
    this.line += 1;
    this.lineStart = this.#scanner.position;
  }
  skipSeparationSpace(allowComments, checkIndent) {
    let lineBreaks = 0;
    let ch = this.#scanner.peek();
    while (ch !== 0) {
      this.skipWhitespaces();
      ch = this.#scanner.peek();
      if (allowComments) {
        this.skipComment();
        ch = this.#scanner.peek();
      }
      if (isEOL(ch)) {
        this.readLineBreak();
        ch = this.#scanner.peek();
        lineBreaks++;
        this.lineIndent = 0;
        this.readIndent();
        ch = this.#scanner.peek();
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && this.lineIndent < checkIndent) {
      this.dispatchWarning("deficient indentation");
    }
    return lineBreaks;
  }
  testDocumentSeparator() {
    let ch = this.#scanner.peek();
    if ((ch === MINUS || ch === DOT) && ch === this.#scanner.peek(1) && ch === this.#scanner.peek(2)) {
      ch = this.#scanner.peek(3);
      if (ch === 0 || isWhiteSpaceOrEOL(ch)) {
        return true;
      }
    }
    return false;
  }
  readPlainScalar(tag, anchor, nodeIndent, withinFlowCollection) {
    let ch = this.#scanner.peek();
    if (isWhiteSpaceOrEOL(ch) || isFlowIndicator(ch) || ch === SHARP || ch === AMPERSAND || ch === ASTERISK || ch === EXCLAMATION || ch === VERTICAL_LINE || ch === GREATER_THAN || ch === SINGLE_QUOTE || ch === DOUBLE_QUOTE || ch === PERCENT || ch === COMMERCIAL_AT || ch === GRAVE_ACCENT) {
      return;
    }
    let following;
    if (ch === QUESTION || ch === MINUS) {
      following = this.#scanner.peek(1);
      if (isWhiteSpaceOrEOL(following) || withinFlowCollection && isFlowIndicator(following)) {
        return;
      }
    }
    let result = "";
    let captureEnd = this.#scanner.position;
    let captureStart = this.#scanner.position;
    let hasPendingContent = false;
    let line = 0;
    while (ch !== 0) {
      if (ch === COLON) {
        following = this.#scanner.peek(1);
        if (isWhiteSpaceOrEOL(following) || withinFlowCollection && isFlowIndicator(following)) {
          break;
        }
      } else if (ch === SHARP) {
        const preceding = this.#scanner.peek(-1);
        if (isWhiteSpaceOrEOL(preceding)) {
          break;
        }
      } else if (this.#scanner.position === this.lineStart && this.testDocumentSeparator() || withinFlowCollection && isFlowIndicator(ch)) {
        break;
      } else if (isEOL(ch)) {
        line = this.line;
        const lineStart = this.lineStart;
        const lineIndent = this.lineIndent;
        this.skipSeparationSpace(false, -1);
        if (this.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = this.#scanner.peek();
          continue;
        } else {
          this.#scanner.position = captureEnd;
          this.line = line;
          this.lineStart = lineStart;
          this.lineIndent = lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        const segment2 = this.captureSegment(captureStart, captureEnd, false);
        if (segment2) result += segment2;
        result += writeFoldedLines(this.line - line);
        captureStart = captureEnd = this.#scanner.position;
        hasPendingContent = false;
      }
      if (!isWhiteSpace(ch)) {
        captureEnd = this.#scanner.position + 1;
      }
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
    const segment = this.captureSegment(captureStart, captureEnd, false);
    if (segment) result += segment;
    if (anchor !== null) this.anchorMap.set(anchor, result);
    if (result) return {
      tag,
      anchor,
      kind: "scalar",
      result
    };
  }
  readSingleQuotedScalar(tag, anchor, nodeIndent) {
    let ch = this.#scanner.peek();
    if (ch !== SINGLE_QUOTE) return;
    let result = "";
    this.#scanner.next();
    let captureStart = this.#scanner.position;
    let captureEnd = this.#scanner.position;
    ch = this.#scanner.peek();
    while (ch !== 0) {
      if (ch === SINGLE_QUOTE) {
        const segment = this.captureSegment(captureStart, this.#scanner.position, true);
        if (segment) result += segment;
        this.#scanner.next();
        ch = this.#scanner.peek();
        if (ch === SINGLE_QUOTE) {
          captureStart = this.#scanner.position;
          this.#scanner.next();
          captureEnd = this.#scanner.position;
        } else {
          if (anchor !== null) this.anchorMap.set(anchor, result);
          return {
            tag,
            anchor,
            kind: "scalar",
            result
          };
        }
      } else if (isEOL(ch)) {
        const segment = this.captureSegment(captureStart, captureEnd, true);
        if (segment) result += segment;
        result += writeFoldedLines(this.skipSeparationSpace(false, nodeIndent));
        captureStart = captureEnd = this.#scanner.position;
      } else if (this.#scanner.position === this.lineStart && this.testDocumentSeparator()) {
        throw this.#createError("Unexpected end of the document within a single quoted scalar");
      } else {
        this.#scanner.next();
        captureEnd = this.#scanner.position;
      }
      ch = this.#scanner.peek();
    }
    throw this.#createError("Unexpected end of the stream within a single quoted scalar");
  }
  readDoubleQuotedScalar(tag, anchor, nodeIndent) {
    let ch = this.#scanner.peek();
    if (ch !== DOUBLE_QUOTE) return;
    let result = "";
    this.#scanner.next();
    let captureEnd = this.#scanner.position;
    let captureStart = this.#scanner.position;
    let tmp;
    ch = this.#scanner.peek();
    while (ch !== 0) {
      if (ch === DOUBLE_QUOTE) {
        const segment = this.captureSegment(captureStart, this.#scanner.position, true);
        if (segment) result += segment;
        this.#scanner.next();
        if (anchor !== null) this.anchorMap.set(anchor, result);
        return {
          tag,
          anchor,
          kind: "scalar",
          result
        };
      }
      if (ch === BACKSLASH) {
        const segment = this.captureSegment(captureStart, this.#scanner.position, true);
        if (segment) result += segment;
        this.#scanner.next();
        ch = this.#scanner.peek();
        if (isEOL(ch)) {
          this.skipSeparationSpace(false, nodeIndent);
        } else if (ch < 256 && SIMPLE_ESCAPE_SEQUENCES.has(ch)) {
          result += SIMPLE_ESCAPE_SEQUENCES.get(ch);
          this.#scanner.next();
        } else if ((tmp = ESCAPED_HEX_LENGTHS.get(ch) ?? 0) > 0) {
          let hexLength = tmp;
          let hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            this.#scanner.next();
            ch = this.#scanner.peek();
            if ((tmp = hexCharCodeToNumber(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throw this.#createError("Cannot read double quoted scalar: expected hexadecimal character");
            }
          }
          result += codepointToChar(hexResult);
          this.#scanner.next();
        } else {
          throw this.#createError("Cannot read double quoted scalar: unknown escape sequence");
        }
        captureStart = captureEnd = this.#scanner.position;
      } else if (isEOL(ch)) {
        const segment = this.captureSegment(captureStart, captureEnd, true);
        if (segment) result += segment;
        result += writeFoldedLines(this.skipSeparationSpace(false, nodeIndent));
        captureStart = captureEnd = this.#scanner.position;
      } else if (this.#scanner.position === this.lineStart && this.testDocumentSeparator()) {
        throw this.#createError("Unexpected end of the document within a double quoted scalar");
      } else {
        this.#scanner.next();
        captureEnd = this.#scanner.position;
      }
      ch = this.#scanner.peek();
    }
    throw this.#createError("Unexpected end of the stream within a double quoted scalar");
  }
  readFlowCollection(tag, anchor, nodeIndent) {
    let ch = this.#scanner.peek();
    let terminator;
    let isMapping = true;
    let result = {};
    if (ch === LEFT_SQUARE_BRACKET) {
      terminator = RIGHT_SQUARE_BRACKET;
      isMapping = false;
      result = [];
    } else if (ch === LEFT_CURLY_BRACKET) {
      terminator = RIGHT_CURLY_BRACKET;
    } else {
      return;
    }
    if (anchor !== null) this.anchorMap.set(anchor, result);
    this.#scanner.next();
    ch = this.#scanner.peek();
    let readNext = true;
    let valueNode = null;
    let keyNode = null;
    let keyTag = null;
    let isExplicitPair = false;
    let isPair = false;
    let following = 0;
    let line = 0;
    const overridableKeys = /* @__PURE__ */ new Set();
    while (ch !== 0) {
      this.skipSeparationSpace(true, nodeIndent);
      ch = this.#scanner.peek();
      if (ch === terminator) {
        this.#scanner.next();
        const kind = isMapping ? "mapping" : "sequence";
        return {
          tag,
          anchor,
          kind,
          result
        };
      }
      if (!readNext) {
        throw this.#createError("Cannot read flow collection: missing comma between flow collection entries");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === QUESTION) {
        following = this.#scanner.peek(1);
        if (isWhiteSpaceOrEOL(following)) {
          isPair = isExplicitPair = true;
          this.#scanner.next();
          this.skipSeparationSpace(true, nodeIndent);
        }
      }
      line = this.line;
      const newState = this.composeNode({
        parentIndent: nodeIndent,
        nodeContext: CONTEXT_FLOW_IN,
        allowToSeek: false,
        allowCompact: true
      });
      if (newState) {
        keyTag = newState.tag || null;
        keyNode = newState.result;
      }
      this.skipSeparationSpace(true, nodeIndent);
      ch = this.#scanner.peek();
      if ((isExplicitPair || this.line === line) && ch === COLON) {
        isPair = true;
        this.#scanner.next();
        ch = this.#scanner.peek();
        this.skipSeparationSpace(true, nodeIndent);
        const newState2 = this.composeNode({
          parentIndent: nodeIndent,
          nodeContext: CONTEXT_FLOW_IN,
          allowToSeek: false,
          allowCompact: true
        });
        if (newState2) valueNode = newState2.result;
      }
      if (isMapping) {
        this.storeMappingPair(result, overridableKeys, keyTag, keyNode, valueNode);
      } else if (isPair) {
        result.push(this.storeMappingPair({}, overridableKeys, keyTag, keyNode, valueNode));
      } else {
        result.push(keyNode);
      }
      this.skipSeparationSpace(true, nodeIndent);
      ch = this.#scanner.peek();
      if (ch === COMMA) {
        readNext = true;
        this.#scanner.next();
        ch = this.#scanner.peek();
      } else {
        readNext = false;
      }
    }
    throw this.#createError("Cannot read flow collection: unexpected end of the stream within a flow collection");
  }
  // Handles block scaler styles: e.g. '|', '>', '|-' and '>-'.
  // https://yaml.org/spec/1.2.2/#81-block-scalar-styles
  readBlockScalar(tag, anchor, nodeIndent) {
    let chomping = CHOMPING_CLIP;
    let didReadContent = false;
    let detectedIndent = false;
    let textIndent = nodeIndent;
    let emptyLines = 0;
    let atMoreIndented = false;
    let ch = this.#scanner.peek();
    let folding = false;
    if (ch === VERTICAL_LINE) {
      folding = false;
    } else if (ch === GREATER_THAN) {
      folding = true;
    } else {
      return;
    }
    let result = "";
    let tmp = 0;
    while (ch !== 0) {
      this.#scanner.next();
      ch = this.#scanner.peek();
      if (ch === PLUS || ch === MINUS) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === PLUS ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throw this.#createError("Cannot read block: chomping mode identifier repeated");
        }
      } else if ((tmp = decimalCharCodeToNumber(ch)) >= 0) {
        if (tmp === 0) {
          throw this.#createError("Cannot read block: indentation width must be greater than 0");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throw this.#createError("Cannot read block: indentation width identifier repeated");
        }
      } else {
        break;
      }
    }
    if (isWhiteSpace(ch)) {
      this.skipWhitespaces();
      this.skipComment();
      ch = this.#scanner.peek();
    }
    while (ch !== 0) {
      this.readLineBreak();
      this.lineIndent = 0;
      ch = this.#scanner.peek();
      while ((!detectedIndent || this.lineIndent < textIndent) && ch === SPACE) {
        this.lineIndent++;
        this.#scanner.next();
        ch = this.#scanner.peek();
      }
      if (!detectedIndent && this.lineIndent > textIndent) {
        textIndent = this.lineIndent;
      }
      if (isEOL(ch)) {
        emptyLines++;
        continue;
      }
      if (this.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (isWhiteSpace(ch)) {
          atMoreIndented = true;
          result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          result += "\n".repeat(emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            result += " ";
          }
        } else {
          result += "\n".repeat(emptyLines);
        }
      } else {
        result += "\n".repeat(didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      const captureStart = this.#scanner.position;
      while (!isEOL(ch) && ch !== 0) {
        this.#scanner.next();
        ch = this.#scanner.peek();
      }
      const segment = this.captureSegment(captureStart, this.#scanner.position, false);
      if (segment) result += segment;
    }
    if (anchor !== null) this.anchorMap.set(anchor, result);
    return {
      tag,
      anchor,
      kind: "scalar",
      result
    };
  }
  readBlockMapping(tag, anchor, nodeIndent, flowIndent) {
    const result = {};
    const overridableKeys = /* @__PURE__ */ new Set();
    let allowCompact = false;
    let line;
    let pos;
    let keyTag = null;
    let keyNode = null;
    let valueNode = null;
    let atExplicitKey = false;
    let detected = false;
    if (anchor !== null) this.anchorMap.set(anchor, result);
    let ch = this.#scanner.peek();
    while (ch !== 0) {
      const following = this.#scanner.peek(1);
      line = this.line;
      pos = this.#scanner.position;
      if ((ch === QUESTION || ch === COLON) && isWhiteSpaceOrEOL(following)) {
        if (ch === QUESTION) {
          if (atExplicitKey) {
            this.storeMappingPair(result, overridableKeys, keyTag, keyNode, null);
            keyTag = null;
            keyNode = null;
            valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throw this.#createError("Cannot read block as explicit mapping pair is incomplete: a key node is missed or followed by a non-tabulated empty line");
        }
        this.#scanner.next();
        ch = following;
      } else {
        const newState = this.composeNode({
          parentIndent: flowIndent,
          nodeContext: CONTEXT_FLOW_OUT,
          allowToSeek: false,
          allowCompact: true
        });
        if (!newState) break;
        if (this.line === line) {
          ch = this.#scanner.peek();
          this.skipWhitespaces();
          ch = this.#scanner.peek();
          if (ch === COLON) {
            this.#scanner.next();
            ch = this.#scanner.peek();
            if (!isWhiteSpaceOrEOL(ch)) {
              throw this.#createError("Cannot read block: a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              this.storeMappingPair(result, overridableKeys, keyTag, keyNode, null);
              keyTag = null;
              keyNode = null;
              valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = newState.tag;
            keyNode = newState.result;
          } else if (detected) {
            throw this.#createError("Cannot read an implicit mapping pair: missing colon");
          } else {
            const { kind, result: result2 } = newState;
            return {
              tag,
              anchor,
              kind,
              result: result2
            };
          }
        } else if (detected) {
          throw this.#createError("Cannot read a block mapping entry: a multiline key may not be an implicit key");
        } else {
          const { kind, result: result2 } = newState;
          return {
            tag,
            anchor,
            kind,
            result: result2
          };
        }
      }
      if (this.line === line || this.lineIndent > nodeIndent) {
        const newState = this.composeNode({
          parentIndent: nodeIndent,
          nodeContext: CONTEXT_BLOCK_OUT,
          allowToSeek: true,
          allowCompact
        });
        if (newState) {
          if (atExplicitKey) {
            keyNode = newState.result;
          } else {
            valueNode = newState.result;
          }
        }
        if (!atExplicitKey) {
          this.storeMappingPair(result, overridableKeys, keyTag, keyNode, valueNode, line, pos);
          keyTag = keyNode = valueNode = null;
        }
        this.skipSeparationSpace(true, -1);
        ch = this.#scanner.peek();
      }
      if (this.lineIndent > nodeIndent && ch !== 0) {
        throw this.#createError("Cannot read block: bad indentation of a mapping entry");
      } else if (this.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      this.storeMappingPair(result, overridableKeys, keyTag, keyNode, null);
    }
    if (detected) return {
      tag,
      anchor,
      kind: "mapping",
      result
    };
  }
  readTagProperty(tag) {
    let isVerbatim = false;
    let isNamed = false;
    let tagHandle = "";
    let tagName;
    let ch = this.#scanner.peek();
    if (ch !== EXCLAMATION) return;
    if (tag !== null) {
      throw this.#createError("Cannot read tag property: duplication of a tag property");
    }
    this.#scanner.next();
    ch = this.#scanner.peek();
    if (ch === SMALLER_THAN) {
      isVerbatim = true;
      this.#scanner.next();
      ch = this.#scanner.peek();
    } else if (ch === EXCLAMATION) {
      isNamed = true;
      tagHandle = "!!";
      this.#scanner.next();
      ch = this.#scanner.peek();
    } else {
      tagHandle = "!";
    }
    let position = this.#scanner.position;
    if (isVerbatim) {
      do {
        this.#scanner.next();
        ch = this.#scanner.peek();
      } while (ch !== 0 && ch !== GREATER_THAN);
      if (!this.#scanner.eof()) {
        tagName = this.#scanner.source.slice(position, this.#scanner.position);
        this.#scanner.next();
        ch = this.#scanner.peek();
      } else {
        throw this.#createError("Cannot read tag property: unexpected end of stream");
      }
    } else {
      while (ch !== 0 && !isWhiteSpaceOrEOL(ch)) {
        if (ch === EXCLAMATION) {
          if (!isNamed) {
            tagHandle = this.#scanner.source.slice(position - 1, this.#scanner.position + 1);
            if (!PATTERN_TAG_HANDLE_REGEXP.test(tagHandle)) {
              throw this.#createError("Cannot read tag property: named tag handle contains invalid characters");
            }
            isNamed = true;
            position = this.#scanner.position + 1;
          } else {
            throw this.#createError("Cannot read tag property: tag suffix cannot contain an exclamation mark");
          }
        }
        this.#scanner.next();
        ch = this.#scanner.peek();
      }
      tagName = this.#scanner.source.slice(position, this.#scanner.position);
      if (PATTERN_FLOW_INDICATORS_REGEXP.test(tagName)) {
        throw this.#createError("Cannot read tag property: tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI_REGEXP.test(tagName)) {
      throw this.#createError(`Cannot read tag property: invalid characters in tag name "${tagName}"`);
    }
    if (isVerbatim) {
      return tagName;
    } else if (this.tagMap.has(tagHandle)) {
      return this.tagMap.get(tagHandle) + tagName;
    } else if (tagHandle === "!") {
      return `!${tagName}`;
    } else if (tagHandle === "!!") {
      return `tag:yaml.org,2002:${tagName}`;
    }
    throw this.#createError(`Cannot read tag property: undeclared tag handle "${tagHandle}"`);
  }
  readAnchorProperty(anchor) {
    let ch = this.#scanner.peek();
    if (ch !== AMPERSAND) return;
    if (anchor !== null) {
      throw this.#createError("Cannot read anchor property: duplicate anchor property");
    }
    this.#scanner.next();
    ch = this.#scanner.peek();
    const position = this.#scanner.position;
    while (ch !== 0 && !isWhiteSpaceOrEOL(ch) && !isFlowIndicator(ch)) {
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
    if (this.#scanner.position === position) {
      throw this.#createError("Cannot read anchor property: name of an anchor node must contain at least one character");
    }
    return this.#scanner.source.slice(position, this.#scanner.position);
  }
  readAlias() {
    if (this.#scanner.peek() !== ASTERISK) return;
    this.#scanner.next();
    let ch = this.#scanner.peek();
    const position = this.#scanner.position;
    while (ch !== 0 && !isWhiteSpaceOrEOL(ch) && !isFlowIndicator(ch)) {
      this.#scanner.next();
      ch = this.#scanner.peek();
    }
    if (this.#scanner.position === position) {
      throw this.#createError("Cannot read alias: alias name must contain at least one character");
    }
    const alias = this.#scanner.source.slice(position, this.#scanner.position);
    if (!this.anchorMap.has(alias)) {
      throw this.#createError(`Cannot read alias: unidentified alias "${alias}"`);
    }
    this.skipSeparationSpace(true, -1);
    return this.anchorMap.get(alias);
  }
  resolveTag(state2) {
    switch (state2.tag) {
      case null:
      case "!":
        return state2;
      case "?": {
        for (const type2 of this.implicitTypes) {
          if (!type2.resolve(state2.result)) continue;
          const result2 = type2.construct(state2.result);
          state2.result = result2;
          state2.tag = type2.tag;
          const { anchor: anchor2 } = state2;
          if (anchor2 !== null) this.anchorMap.set(anchor2, result2);
          return state2;
        }
        return state2;
      }
    }
    const kind = state2.kind ?? "fallback";
    const map3 = this.typeMap[kind];
    const type = map3.get(state2.tag);
    if (!type) {
      throw this.#createError(`Cannot resolve unknown tag !<${state2.tag}>`);
    }
    if (state2.result !== null && type.kind !== state2.kind) {
      throw this.#createError(`Unacceptable node kind for !<${state2.tag}> tag: it should be "${type.kind}", not "${state2.kind}"`);
    }
    if (!type.resolve(state2.result)) {
      throw this.#createError(`Cannot resolve a node with !<${state2.tag}> explicit tag`);
    }
    const result = type.construct(state2.result);
    state2.result = result;
    const { anchor } = state2;
    if (anchor !== null) this.anchorMap.set(anchor, result);
    return state2;
  }
  composeNode({ parentIndent, nodeContext, allowToSeek, allowCompact }) {
    let indentStatus = 1;
    let atNewLine = false;
    const allowBlockScalars = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    let allowBlockCollections = allowBlockScalars;
    const allowBlockStyles = allowBlockScalars;
    if (allowToSeek) {
      if (this.skipSeparationSpace(true, -1)) {
        atNewLine = true;
        indentStatus = getIndentStatus(this.lineIndent, parentIndent);
      }
    }
    let tag = null;
    let anchor = null;
    if (indentStatus === 1) {
      while (true) {
        const newTag = this.readTagProperty(tag);
        if (newTag) {
          tag = newTag;
        } else {
          const newAnchor = this.readAnchorProperty(anchor);
          if (!newAnchor) break;
          anchor = newAnchor;
        }
        if (this.skipSeparationSpace(true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          indentStatus = getIndentStatus(this.lineIndent, parentIndent);
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1) {
      const cond = CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext;
      const flowIndent = cond ? parentIndent : parentIndent + 1;
      if (allowBlockCollections) {
        const blockIndent = this.#scanner.position - this.lineStart;
        const blockSequenceState = this.readBlockSequence(tag, anchor, blockIndent);
        if (blockSequenceState) return this.resolveTag(blockSequenceState);
        const blockMappingState = this.readBlockMapping(tag, anchor, blockIndent, flowIndent);
        if (blockMappingState) return this.resolveTag(blockMappingState);
      }
      const flowCollectionState = this.readFlowCollection(tag, anchor, flowIndent);
      if (flowCollectionState) return this.resolveTag(flowCollectionState);
      if (allowBlockScalars) {
        const blockScalarState = this.readBlockScalar(tag, anchor, flowIndent);
        if (blockScalarState) return this.resolveTag(blockScalarState);
      }
      const singleQuoteState = this.readSingleQuotedScalar(tag, anchor, flowIndent);
      if (singleQuoteState) return this.resolveTag(singleQuoteState);
      const doubleQuoteState = this.readDoubleQuotedScalar(tag, anchor, flowIndent);
      if (doubleQuoteState) return this.resolveTag(doubleQuoteState);
      const alias = this.readAlias();
      if (alias) {
        if (tag !== null || anchor !== null) {
          throw this.#createError("Cannot compose node: alias node should not have any properties");
        }
        return this.resolveTag({
          tag,
          anchor,
          kind: null,
          result: alias
        });
      }
      const plainScalarState = this.readPlainScalar(tag, anchor, flowIndent, CONTEXT_FLOW_IN === nodeContext);
      if (plainScalarState) {
        plainScalarState.tag ??= "?";
        return this.resolveTag(plainScalarState);
      }
    } else if (indentStatus === 0 && CONTEXT_BLOCK_OUT === nodeContext && allowBlockCollections) {
      const blockIndent = this.#scanner.position - this.lineStart;
      const newState2 = this.readBlockSequence(tag, anchor, blockIndent);
      if (newState2) return this.resolveTag(newState2);
    }
    const newState = this.resolveTag({
      tag,
      anchor,
      kind: null,
      result: null
    });
    if (newState.tag !== null || newState.anchor !== null) return newState;
  }
  readDirectives() {
    let hasDirectives = false;
    let version = null;
    let ch = this.#scanner.peek();
    while (ch !== 0) {
      this.skipSeparationSpace(true, -1);
      ch = this.#scanner.peek();
      if (this.lineIndent > 0 || ch !== PERCENT) {
        break;
      }
      hasDirectives = true;
      this.#scanner.next();
      ch = this.#scanner.peek();
      let position = this.#scanner.position;
      while (ch !== 0 && !isWhiteSpaceOrEOL(ch)) {
        this.#scanner.next();
        ch = this.#scanner.peek();
      }
      const directiveName = this.#scanner.source.slice(position, this.#scanner.position);
      const directiveArgs = [];
      if (directiveName.length < 1) {
        throw this.#createError("Cannot read document: directive name length must be greater than zero");
      }
      while (ch !== 0) {
        this.skipWhitespaces();
        this.skipComment();
        ch = this.#scanner.peek();
        if (isEOL(ch)) break;
        position = this.#scanner.position;
        while (ch !== 0 && !isWhiteSpaceOrEOL(ch)) {
          this.#scanner.next();
          ch = this.#scanner.peek();
        }
        directiveArgs.push(this.#scanner.source.slice(position, this.#scanner.position));
      }
      if (ch !== 0) this.readLineBreak();
      switch (directiveName) {
        case "YAML":
          if (version !== null) {
            throw this.#createError("Cannot handle YAML directive: duplication of %YAML directive");
          }
          version = this.yamlDirectiveHandler(directiveArgs);
          break;
        case "TAG":
          this.tagDirectiveHandler(directiveArgs);
          break;
        default:
          this.dispatchWarning(`unknown document directive "${directiveName}"`);
          break;
      }
      ch = this.#scanner.peek();
    }
    return hasDirectives;
  }
  readDocument() {
    const documentStart = this.#scanner.position;
    this.checkLineBreaks = false;
    this.tagMap = /* @__PURE__ */ new Map();
    this.anchorMap = /* @__PURE__ */ new Map();
    const hasDirectives = this.readDirectives();
    this.skipSeparationSpace(true, -1);
    let result = null;
    if (this.lineIndent === 0 && this.#scanner.peek() === MINUS && this.#scanner.peek(1) === MINUS && this.#scanner.peek(2) === MINUS) {
      this.#scanner.position += 3;
      this.skipSeparationSpace(true, -1);
    } else if (hasDirectives) {
      throw this.#createError("Cannot read document: directives end mark is expected");
    }
    const newState = this.composeNode({
      parentIndent: this.lineIndent - 1,
      nodeContext: CONTEXT_BLOCK_OUT,
      allowToSeek: false,
      allowCompact: true
    });
    if (newState) result = newState.result;
    this.skipSeparationSpace(true, -1);
    if (this.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS_REGEXP.test(this.#scanner.source.slice(documentStart, this.#scanner.position))) {
      this.dispatchWarning("non-ASCII line breaks are interpreted as content");
    }
    if (this.#scanner.position === this.lineStart && this.testDocumentSeparator()) {
      if (this.#scanner.peek() === DOT) {
        this.#scanner.position += 3;
        this.skipSeparationSpace(true, -1);
      }
    } else if (!this.#scanner.eof()) {
      throw this.#createError("Cannot read document: end of the stream or a document separator is expected");
    }
    return result;
  }
  *readDocuments(options = {}) {
    const { singleDocument = false } = options;
    let yielded = 0;
    while (!this.#scanner.eof()) {
      if (singleDocument && yielded > 0) {
        throw this.#createError("Found more than 1 document in the stream: expected a single document");
      }
      yield this.readDocument();
      yielded++;
    }
  }
};

// deno:https://jsr.io/@std/yaml/1.3.0/parse.ts
function sanitizeInput(input) {
  input = String(input);
  if (input.length > 0) {
    if (!isEOL(input.charCodeAt(input.length - 1))) input += "\n";
    if (input.charCodeAt(0) === 65279) input = input.slice(1);
  }
  return input;
}
function parse(content, options = {}) {
  content = sanitizeInput(content);
  const state2 = new LoaderState(content, {
    ...options,
    schema: SCHEMA_MAP.get(options.schema)
  });
  const documents = state2.readDocuments({
    singleDocument: true
  });
  const document = documents.next().value;
  documents.next();
  return document ?? null;
}

// supabase/functions/_shared/deploy-markers.ts
function parseMarkerMessage(message) {
  const marker = {
    deployedSHA: "",
    parentSHA: "",
    backupKey: ""
  };
  for (const rawLine of message.split("\n")) {
    const line = rawLine.trim();
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (key === "deployedSHA") marker.deployedSHA = value;
    else if (key === "parentSHA") marker.parentSHA = value;
    else if (key === "backupKey") marker.backupKey = value;
  }
  return marker;
}

// supabase/functions/_shared/publish-readiness/checks.ts
var PRODUCTION_ENVIRONMENT = "production";
var PRODUCTION_MARKER_TAG = "deploy/production/current";
var CALLER_FILES = {
  production: ".github/workflows/deploy-production.yml",
  staging: ".github/workflows/deploy-staging.yml",
  rollback: ".github/workflows/rollback.yml"
};
var SHARED_DEPLOY_WORKFLOW = `${SHARED_WORKFLOWS_REPO}/.github/workflows/deploy.yml`;
var HOSTS = READINESS_HOSTS;
var HOST_SECRETS = {
  vercel: [
    "VERCEL_TOKEN"
  ],
  netlify: [
    "NETLIFY_AUTH_TOKEN"
  ],
  cloudflare: [
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID"
  ]
};
var HOST_DEPLOY_BOTS = {
  "vercel[bot]": "vercel",
  "netlify[bot]": "netlify",
  "cloudflare-workers-and-pages[bot]": "cloudflare"
};
var HOST_DEPLOY_LOOKBACK_MS = 7 * 24 * 60 * 60 * 1e3;
var ROLLBACK_INPUTS = [
  "target_environment",
  "target_ref",
  "backup_key",
  "row_id"
];
var PRODUCTION_INPUTS = [
  "tag",
  "triggered_by"
];
function state(checkedAt, status, reason, detail) {
  const s = {
    status,
    checked_at: checkedAt
  };
  if (reason) s.reason = reason;
  if (detail) s.detail = detail;
  return s;
}
function unreadable(checkedAt, ...outcomes) {
  if (outcomes.some((o) => o.kind === "forbidden")) {
    return state(checkedAt, "red", "permissions_missing", "MakeItShip's GitHub App is missing a permission");
  }
  if (outcomes.some((o) => o.kind === "failed")) {
    return state(checkedAt, "unknown", "check_failed", "GitHub did not answer");
  }
  return null;
}
var isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function checkStagingBranch(branch, stagingBranch, checkedAt) {
  if (branch.kind === "ok") return state(checkedAt, "green", void 0, stagingBranch);
  if (branch.kind === "absent") return state(checkedAt, "red", "missing", `No branch named ${stagingBranch}`);
  return unreadable(checkedAt, branch);
}
var TOO_WIDE_BYPASS_TYPES = /* @__PURE__ */ new Set([
  "RepositoryRole",
  "OrganizationAdmin",
  "EnterpriseOwner"
]);
function checkProtection(rules, rulesets, productionBranch, checkedAt) {
  const bad = rules.kind === "absent" ? null : unreadable(checkedAt, rules);
  if (bad) return bad;
  const active = rules.kind === "ok" ? rules.value : [];
  const pullRequestRules = active.filter((r) => r.type === "pull_request");
  if (pullRequestRules.length === 0) {
    return state(checkedAt, "yellow", "not_enforced", `GitHub enforces no pull-request rule on ${productionBranch}`);
  }
  for (const rule of pullRequestRules) {
    if (rule.ruleset_id === void 0) continue;
    const ruleset = rulesets.get(rule.ruleset_id);
    if (!ruleset || ruleset.kind !== "ok" || ruleset.value.bypass_actors === null) continue;
    const wide = ruleset.value.bypass_actors.find((a) => a.bypass_mode === "always" && TOO_WIDE_BYPASS_TYPES.has(a.actor_type));
    if (wide) {
      return state(checkedAt, "red", "bypass_too_wide", `The rule on ${productionBranch} can be bypassed by ${wide.actor_type === "RepositoryRole" ? "a repository role" : wide.actor_type}`);
    }
  }
  return state(checkedAt, "green", void 0, productionBranch);
}
function checkProductionEnvironment(env, checkedAt) {
  if (env.kind === "ok") return state(checkedAt, "green", void 0, PRODUCTION_ENVIRONMENT);
  if (env.kind === "absent") {
    return state(checkedAt, "red", "missing", `No environment named ${PRODUCTION_ENVIRONMENT}`);
  }
  return unreadable(checkedAt, env);
}
var fileName = (name) => CALLER_FILES[name].split("/").pop();
function parseCallerText(file) {
  if (file.text === null) return "too_large";
  try {
    const doc = parse(file.text);
    return isObj(doc) ? doc : "invalid";
  } catch {
    return "invalid";
  }
}
function triggers(doc) {
  const on = doc.on ?? doc["true"];
  if (typeof on === "string") return {
    [on]: null
  };
  if (Array.isArray(on)) return Object.fromEntries(on.filter((e) => typeof e === "string").map((e) => [
    e,
    null
  ]));
  return isObj(on) ? on : null;
}
function dispatchInputs(doc) {
  const dispatch = triggers(doc)?.workflow_dispatch;
  return isObj(dispatch) && isObj(dispatch.inputs) ? dispatch.inputs : {};
}
function findSharedJob(doc) {
  const jobs = isObj(doc.jobs) ? doc.jobs : {};
  const prefix = `${SHARED_DEPLOY_WORKFLOW}@`.toLowerCase();
  for (const job of Object.values(jobs)) {
    if (!isObj(job) || typeof job.uses !== "string") continue;
    const uses = job.uses.trim();
    if (uses.toLowerCase().startsWith(prefix)) return {
      job,
      ref: uses.slice(prefix.length)
    };
  }
  return {
    job: null
  };
}
function isSupportedSharedRef(ref) {
  const m = /^(v\d+)(\.\d+\.\d+)?$/.exec(ref);
  return m !== null && SUPPORTED_SHARED_MAJORS.includes(m[1]);
}
function grantsContentsWrite(doc, job) {
  const effective = job.permissions !== void 0 ? job.permissions : doc.permissions;
  if (effective === "write-all") return true;
  return isObj(effective) && effective.contents === "write";
}
function hostOf(job) {
  const host = isObj(job.with) ? job.with.host : void 0;
  return typeof host === "string" && HOSTS.includes(host) ? host : null;
}
function secretNamesOf(job) {
  if (!isObj(job.secrets)) return [];
  const names = /* @__PURE__ */ new Set();
  for (const value of Object.values(job.secrets)) {
    if (typeof value !== "string") continue;
    for (const m of value.matchAll(/\$\{\{\s*secrets\.([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g)) names.add(m[1]);
  }
  return [
    ...names
  ];
}
function structureProblem(name, doc, match) {
  const file = fileName(name);
  const on = triggers(doc);
  if (name === "production") {
    const events = on ? Object.keys(on) : [];
    if (events.length !== 1 || events[0] !== "workflow_dispatch") {
      return {
        reason: "wrong_trigger",
        detail: `${file} must start only by workflow_dispatch`
      };
    }
    const inputs = dispatchInputs(doc);
    const lacking = PRODUCTION_INPUTS.filter((i) => !(i in inputs));
    if (lacking.length > 0) {
      return {
        reason: "wrong_inputs",
        detail: `${file} does not take ${lacking.join(", ")}`
      };
    }
    if (typeof doc.name !== "string" || !doc.name.toLowerCase().includes("production")) {
      return {
        reason: "wrong_name",
        detail: `The word Production is missing from ${file}'s name`
      };
    }
  } else {
    if (!on || !("workflow_dispatch" in on)) {
      return {
        reason: "wrong_trigger",
        detail: `${file} cannot be started by MakeItShip (no workflow_dispatch)`
      };
    }
  }
  if (name === "rollback") {
    const inputs = dispatchInputs(doc);
    const lacking = ROLLBACK_INPUTS.filter((i) => !(i in inputs));
    if (lacking.length > 0) {
      return {
        reason: "wrong_inputs",
        detail: `${file} does not take ${lacking.join(", ")}`
      };
    }
    const runName = typeof doc["run-name"] === "string" ? doc["run-name"] : "";
    if (!/change \$\{\{\s*inputs\.row_id\s*\}\}/.test(runName)) {
      return {
        reason: "wrong_inputs",
        detail: `${file}'s run-name lacks change \${{ inputs.row_id }}`
      };
    }
  }
  if (match.job === null) {
    return {
      reason: "not_shared",
      detail: `${file} does not use ${SHARED_DEPLOY_WORKFLOW}`
    };
  }
  if (!isSupportedSharedRef(match.ref)) {
    return {
      reason: "unsupported_version",
      detail: `${file} uses @${match.ref}; supported: @${SUPPORTED_SHARED_MAJORS.join(", @")}`
    };
  }
  if (name === "production" && hostOf(match.job) === null) {
    return {
      reason: "host_unknown",
      detail: `${file} names no host (vercel, netlify or cloudflare)`
    };
  }
  return null;
}
function analyzeCallers(files) {
  const analysis = {
    problem: null,
    unreadable: null,
    callers: {},
    host: null,
    productionSecrets: []
  };
  for (const name of Object.keys(CALLER_FILES)) {
    const outcome = files[name];
    const file = fileName(name);
    if (outcome.kind === "forbidden" || outcome.kind === "failed") {
      if (!analysis.unreadable || outcome.kind === "forbidden") analysis.unreadable = outcome;
      continue;
    }
    if (outcome.kind === "absent") {
      analysis.problem ??= {
        reason: "missing",
        detail: `${file} is missing`
      };
      continue;
    }
    const doc = parseCallerText(outcome.value);
    if (doc === "too_large" || doc === "invalid") {
      analysis.problem ??= {
        reason: "invalid_file",
        detail: doc === "too_large" ? `${file} is too large to check` : `${file} is not valid YAML`
      };
      continue;
    }
    const match = findSharedJob(doc);
    const problem = structureProblem(name, doc, match);
    if (match.job !== null) {
      analysis.callers[name] = {
        doc,
        job: match.job,
        host: hostOf(match.job),
        grantsContentsWrite: grantsContentsWrite(doc, match.job)
      };
    }
    if (name === "production" && match.job !== null) {
      analysis.host = hostOf(match.job);
      analysis.productionSecrets = secretNamesOf(match.job);
    }
    if (problem) analysis.problem ??= problem;
  }
  return analysis;
}
function checkDeployFiles(analysis, checkedAt) {
  if (analysis.problem) return state(checkedAt, "red", analysis.problem.reason, analysis.problem.detail);
  if (analysis.unreadable) return unreadable(checkedAt, analysis.unreadable);
  return state(checkedAt, "green", void 0, analysis.host ?? void 0);
}
function checkDeployFilesOnBranches(branches, checkedAt) {
  const production = branches.find((b) => b.role === "production");
  const staging = branches.find((b) => b.role === "staging");
  if (production && staging && production.analysis.problem && !production.analysis.unreadable && checkDeployFiles(staging.analysis, checkedAt).status === "green") {
    return state(checkedAt, "red", "not_merged", production.branch);
  }
  const results = branches.map(({ branch, analysis }) => ({
    branch,
    item: checkDeployFiles(analysis, checkedAt)
  }));
  const worst = results.find((r) => r.item.status === "red") ?? results.find((r) => r.item.status !== "green");
  if (!worst) return results[0]?.item ?? state(checkedAt, "unknown", "check_failed");
  const detail = `${worst.branch}: ${worst.item.detail ?? ""}`.trim();
  return state(checkedAt, worst.item.status, worst.item.reason, detail.slice(0, 200));
}
function checkHostKey(analysis, repoSecrets, envSecrets, checkedAt) {
  if (analysis.host === null) {
    if (analysis.callers.production === void 0 && analysis.unreadable) {
      return unreadable(checkedAt, analysis.unreadable);
    }
    return state(checkedAt, "red", "host_unknown", "The host could not be told from deploy-production.yml");
  }
  const required = analysis.productionSecrets.length > 0 ? analysis.productionSecrets : [
    ...HOST_SECRETS[analysis.host]
  ];
  const present = /* @__PURE__ */ new Set([
    ...repoSecrets.kind === "ok" ? repoSecrets.value : [],
    ...envSecrets.kind === "ok" ? envSecrets.value : []
  ]);
  const lacking = required.filter((n) => !present.has(n));
  if (lacking.length === 0) return state(checkedAt, "green", void 0, required.join(", "));
  const bad = unreadable(checkedAt, repoSecrets, envSecrets.kind === "absent" ? {
    kind: "ok",
    value: []
  } : envSecrets);
  if (bad) return bad;
  return state(checkedAt, "red", "missing", `Secret ${lacking.join(", ")} is missing`);
}
function checkWorkflowPermissions(permissions, analysis, checkedAt) {
  if (permissions.kind === "ok" && permissions.value.default_workflow_permissions === "write") {
    return state(checkedAt, "green", void 0, "write");
  }
  if (permissions.kind !== "ok") {
    return unreadable(checkedAt, permissions) ?? state(checkedAt, "unknown", "check_failed", "GitHub did not return the workflow permissions");
  }
  const lacking = Object.keys(CALLER_FILES).filter((n) => analysis.callers[n]?.grantsContentsWrite !== true);
  if (lacking.length === 0) return state(checkedAt, "green", void 0, "read; the callers grant contents: write");
  if (analysis.unreadable && lacking.every((n) => analysis.callers[n] === void 0)) {
    return unreadable(checkedAt, analysis.unreadable);
  }
  return state(checkedAt, "red", "read_only_token", `The workflow token is read-only and ${lacking.map(fileName).join(", ")} does not grant contents: write`);
}
function checkHostAutodeployOff(deployments, production, since, checkedAt, access) {
  const sinceMs = since ? Date.parse(since) : Date.parse(checkedAt) - HOST_DEPLOY_LOOKBACK_MS;
  const all = deployments.flatMap((d) => d.kind === "ok" ? d.value : []);
  const hostDeploy = all.find((d) => {
    const host = d.creator_login ? HOST_DEPLOY_BOTS[d.creator_login.toLowerCase()] : void 0;
    if (!host) return false;
    const onProduction = d.ref === production.branch || d.ref === `refs/heads/${production.branch}` || production.headSha !== null && d.sha === production.headSha;
    const created = Date.parse(d.created_at);
    return onProduction && !(Number.isFinite(created) && Number.isFinite(sinceMs) && created <= sinceMs);
  });
  if (hostDeploy) {
    return state(checkedAt, "red", "host_deploys_main", `${hostDeploy.creator_login} deployed ${production.branch} on ${hostDeploy.created_at}`);
  }
  const bad = unreadable(checkedAt, ...deployments.filter((d) => d.kind !== "absent"));
  if (bad) return bad;
  if (access.host === null) return state(checkedAt, "red", "host_unknown", "The deploy files don't name the host yet");
  if (access.checkedFor !== access.host) return state(checkedAt, "yellow", "host_access_unchecked", access.host);
  return state(checkedAt, "green", void 0, access.host);
}
function checkRollbackReady(tag, checkedAt) {
  if (tag.kind === "absent") {
    return state(checkedAt, "neutral", "not_deployed_yet", "Nothing is in production yet");
  }
  if (tag.kind !== "ok") return unreadable(checkedAt, tag);
  if (!tag.value.annotated || tag.value.message === null) {
    return state(checkedAt, "red", "missing", `${PRODUCTION_MARKER_TAG} is not an annotated tag`);
  }
  const marker = parseMarkerMessage(tag.value.message);
  if (!marker.deployedSHA) {
    return state(checkedAt, "red", "missing", `${PRODUCTION_MARKER_TAG} carries no deploy marker`);
  }
  if (!marker.parentSHA) {
    return state(checkedAt, "neutral", "not_deployed_yet", "One production deploy so far; nothing to go back to");
  }
  return state(checkedAt, "green", void 0, marker.parentSHA.slice(0, 7));
}

// supabase/functions/_shared/publish-readiness/reader.ts
var MAX_WORKFLOW_FILE_BYTES = 64 * 1024;

// supabase/functions/_shared/publish-readiness/github-reader.ts
var GITHUB_API = "https://api.github.com";
var GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
};
var DEFAULT_TIMEOUT_MS = 1e4;
var MAX_RETRIES = 2;
var BACKOFF_MS = [
  300,
  900
];
var MAX_RETRY_AFTER_MS = 5e3;
var MAX_PAGES = 5;
var defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function retryAfterMs(response) {
  const header = response.headers.get("retry-after");
  if (header === null) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1e3;
  const date = Date.parse(header);
  if (Number.isNaN(date)) return null;
  return Math.max(0, date - Date.now());
}
function isRateLimit403(response) {
  return response.headers.has("retry-after") || response.headers.get("x-ratelimit-remaining") === "0";
}
async function githubCall(options, method, path, body) {
  const doFetch = options.fetch ?? fetch;
  const sleep = options.sleep ?? defaultSleep;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retryable = method === "GET";
  for (let attempt = 0; ; attempt++) {
    const canRetry = retryable && attempt < MAX_RETRIES;
    let response;
    try {
      response = await doFetch(`${GITHUB_API}${path}`, {
        method,
        headers: {
          ...GITHUB_HEADERS,
          Authorization: `Bearer ${options.token}`,
          ...body === void 0 ? {} : {
            "Content-Type": "application/json"
          }
        },
        body: body === void 0 ? void 0 : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      const timedOut = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
      console.warn(`[publish-readiness] ${method} ${path} -> ${timedOut ? "timeout" : "network error"}`);
      if (!timedOut && canRetry) {
        await sleep(BACKOFF_MS[attempt]);
        continue;
      }
      return {
        kind: "failed"
      };
    }
    const status = response.status;
    if (response.ok) {
      if (status === 204) return {
        kind: "ok",
        status,
        json: null
      };
      try {
        return {
          kind: "ok",
          status,
          json: await response.json()
        };
      } catch {
        console.warn(`[publish-readiness] ${method} ${path} -> ${status} (unreadable body)`);
        return {
          kind: "failed",
          status
        };
      }
    }
    const rateLimited = status === 429 || status === 403 && isRateLimit403(response);
    if (status === 404) {
      await response.body?.cancel();
      return {
        kind: "absent"
      };
    }
    if (status === 403 && !rateLimited) {
      const message = await errorMessage(response);
      console.warn(`[publish-readiness] ${method} ${path} -> 403 (not accessible by integration)`);
      return {
        kind: "forbidden",
        message
      };
    }
    console.warn(`[publish-readiness] ${method} ${path} -> ${status}`);
    if ((status >= 500 || rateLimited) && canRetry) {
      const wait = retryAfterMs(response);
      await response.body?.cancel();
      if (wait !== null && wait > MAX_RETRY_AFTER_MS) return {
        kind: "failed",
        status
      };
      await sleep(wait ?? BACKOFF_MS[attempt]);
      continue;
    }
    if (status >= 400 && status < 500 && !rateLimited) {
      return {
        kind: "failed",
        status,
        message: await errorMessage(response)
      };
    }
    await response.body?.cancel();
    return {
      kind: "failed",
      status
    };
  }
}
async function errorMessage(response) {
  try {
    const json = await response.json();
    return isObj2(json) && typeof json.message === "string" ? json.message.slice(0, 300) : void 0;
  } catch {
    return void 0;
  }
}
function seg(value) {
  return value.split("/").map(encodeURIComponent).join("/");
}
function decodeBase64Utf8(content) {
  const binary2 = atob(content.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary2, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
var isObj2 = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function bare(outcome) {
  if (outcome.kind === "forbidden") return {
    kind: "forbidden"
  };
  if (outcome.kind === "failed") return outcome.status === void 0 ? {
    kind: "failed"
  } : {
    kind: "failed",
    status: outcome.status
  };
  return outcome;
}
function map2(outcome, pick) {
  if (outcome.kind !== "ok") return bare(outcome);
  const value = pick(outcome.json);
  return value === null ? {
    kind: "failed",
    status: outcome.status
  } : {
    kind: "ok",
    value
  };
}
function createGithubRepoReader(options) {
  const base = `/repos/${encodeURIComponent(options.owner)}/${encodeURIComponent(options.repo)}`;
  const get = (path) => githubCall(options, "GET", `${base}${path}`);
  async function listNames(path) {
    const names = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const outcome = await get(`${path}?per_page=100&page=${page}`);
      if (outcome.kind !== "ok") return bare(outcome);
      const json = outcome.json;
      if (!isObj2(json) || !Array.isArray(json.secrets)) return {
        kind: "failed",
        status: outcome.status
      };
      for (const s of json.secrets) if (isObj2(s) && typeof s.name === "string") names.push(s.name);
      const total = typeof json.total_count === "number" ? json.total_count : names.length;
      if (json.secrets.length < 100 || names.length >= total) break;
    }
    return {
      kind: "ok",
      value: names
    };
  }
  return {
    async getFile(path, ref) {
      const outcome = await get(`/contents/${seg(path)}?ref=${encodeURIComponent(ref)}`);
      if (outcome.kind === "ok" && !(isObj2(outcome.json) && outcome.json.type === "file")) {
        return {
          kind: "absent"
        };
      }
      return map2(outcome, (json) => {
        if (!isObj2(json) || typeof json.size !== "number") return null;
        if (json.size > MAX_WORKFLOW_FILE_BYTES) return {
          size: json.size,
          text: null
        };
        if (typeof json.content !== "string") return null;
        try {
          return {
            size: json.size,
            text: decodeBase64Utf8(json.content)
          };
        } catch {
          return null;
        }
      });
    },
    async getBranch(branch) {
      return map2(await get(`/branches/${encodeURIComponent(branch)}`), (json) => {
        if (!isObj2(json) || typeof json.name !== "string" || !isObj2(json.commit)) return null;
        const sha = json.commit.sha;
        return typeof sha === "string" ? {
          name: json.name,
          headSha: sha
        } : null;
      });
    },
    async getBranchRules(branch) {
      return map2(await get(`/rules/branches/${encodeURIComponent(branch)}?per_page=100`), (json) => {
        if (!Array.isArray(json)) return null;
        const rules = [];
        for (const r of json) {
          if (!isObj2(r) || typeof r.type !== "string") continue;
          rules.push({
            type: r.type,
            ruleset_id: typeof r.ruleset_id === "number" ? r.ruleset_id : void 0,
            ruleset_source_type: typeof r.ruleset_source_type === "string" ? r.ruleset_source_type : void 0
          });
        }
        return rules;
      });
    },
    async getRuleset(id) {
      return map2(await get(`/rulesets/${id}`), (json) => {
        if (!isObj2(json) || typeof json.id !== "number") return null;
        let bypass = null;
        if (Array.isArray(json.bypass_actors)) {
          bypass = json.bypass_actors.filter(isObj2).map((a) => ({
            actor_id: typeof a.actor_id === "number" ? a.actor_id : null,
            actor_type: typeof a.actor_type === "string" ? a.actor_type : "",
            bypass_mode: typeof a.bypass_mode === "string" ? a.bypass_mode : ""
          }));
        }
        return {
          id: json.id,
          enforcement: typeof json.enforcement === "string" ? json.enforcement : "",
          bypass_actors: bypass
        };
      });
    },
    async getEnvironment(name) {
      return map2(await get(`/environments/${encodeURIComponent(name)}`), () => true);
    },
    listRepoSecretNames: () => listNames("/actions/secrets"),
    listEnvironmentSecretNames: (environment) => listNames(`/environments/${encodeURIComponent(environment)}/secrets`),
    async getWorkflowPermissions() {
      return map2(await get(`/actions/permissions/workflow`), (json) => {
        if (!isObj2(json)) return null;
        const p = json.default_workflow_permissions;
        return p === "read" || p === "write" ? {
          default_workflow_permissions: p
        } : null;
      });
    },
    async listDeployments(filter) {
      const query = new URLSearchParams({
        per_page: "50"
      });
      if (filter.ref) query.set("ref", filter.ref);
      if (filter.sha) query.set("sha", filter.sha);
      return map2(await get(`/deployments?${query}`), (json) => {
        if (!Array.isArray(json)) return null;
        const out = [];
        for (const d of json) {
          if (!isObj2(d) || typeof d.id !== "number") continue;
          out.push({
            id: d.id,
            ref: typeof d.ref === "string" ? d.ref : "",
            sha: typeof d.sha === "string" ? d.sha : "",
            environment: typeof d.environment === "string" ? d.environment : "",
            created_at: typeof d.created_at === "string" ? d.created_at : "",
            creator_login: isObj2(d.creator) && typeof d.creator.login === "string" ? d.creator.login : null
          });
        }
        return out;
      });
    },
    async getTagRef(tag) {
      const ref = await get(`/git/ref/tags/${seg(tag)}`);
      if (ref.kind !== "ok") return bare(ref);
      const object = isObj2(ref.json) && isObj2(ref.json.object) ? ref.json.object : null;
      if (!object || typeof object.sha !== "string") return {
        kind: "failed",
        status: ref.status
      };
      if (object.type !== "tag") return {
        kind: "ok",
        value: {
          annotated: false,
          message: null
        }
      };
      return map2(await get(`/git/tags/${encodeURIComponent(object.sha)}`), (json) => isObj2(json) && typeof json.message === "string" ? {
        annotated: true,
        message: json.message
      } : null);
    }
  };
}

// supabase/functions/_shared/publish-readiness/local-reader.ts
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
var failed = () => Promise.resolve({
  kind: "failed"
});
var nodeFs = {
  stat: (p) => stat(p),
  readFile: (p) => readFile(p, "utf8")
};
async function readLocal(fs, root, path) {
  const full = join(root, path);
  try {
    const info = await fs.stat(full);
    if (!info.isFile()) return {
      kind: "absent"
    };
    if (info.size > MAX_WORKFLOW_FILE_BYTES) return {
      kind: "ok",
      value: {
        size: info.size,
        text: null
      }
    };
    return {
      kind: "ok",
      value: {
        size: info.size,
        text: await fs.readFile(full)
      }
    };
  } catch (err) {
    return err.code === "ENOENT" ? {
      kind: "absent"
    } : {
      kind: "failed"
    };
  }
}
function createLocalFirstReader(remote, opts) {
  const fs = opts.fs ?? nodeFs;
  return {
    getFile: (path, ref) => ref === opts.localRef ? readLocal(fs, opts.root, path) : remote ? remote.getFile(path, ref) : failed(),
    getBranch: (branch) => remote ? remote.getBranch(branch) : failed(),
    getBranchRules: (branch) => remote ? remote.getBranchRules(branch) : failed(),
    getRuleset: (id) => remote ? remote.getRuleset(id) : failed(),
    getEnvironment: (name) => remote ? remote.getEnvironment(name) : failed(),
    listRepoSecretNames: () => remote ? remote.listRepoSecretNames() : failed(),
    listEnvironmentSecretNames: (environment) => remote ? remote.listEnvironmentSecretNames(environment) : failed(),
    getWorkflowPermissions: () => remote ? remote.getWorkflowPermissions() : failed(),
    listDeployments: (filter) => remote ? remote.listDeployments(filter) : failed(),
    getTagRef: (tag) => remote ? remote.getTagRef(tag) : failed()
  };
}

// supabase/functions/_shared/publish-readiness/run.ts
var MAX_CONCURRENT_READS = 4;
function limiter(max) {
  let active = 0;
  const queue = [];
  return async function run2(task) {
    if (active >= max) await new Promise((resolve) => queue.push(resolve));
    active++;
    try {
      return await task();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}
async function safe(read) {
  try {
    return await read();
  } catch {
    return {
      kind: "failed"
    };
  }
}
async function runReadinessChecks(reader, options) {
  const limit = limiter(MAX_CONCURRENT_READS);
  const read = (fn) => limit(() => safe(fn));
  const at = options.startedAt;
  const names = [
    "production",
    "staging",
    "rollback"
  ];
  const stagingP = read(() => reader.getBranch(options.stagingBranch));
  const productionP = read(() => reader.getBranch(options.defaultBranch));
  const rulesP = read(() => reader.getBranchRules(options.defaultBranch));
  const environmentP = read(() => reader.getEnvironment(PRODUCTION_ENVIRONMENT));
  const repoSecretsP = read(() => reader.listRepoSecretNames());
  const envSecretsP = read(() => reader.listEnvironmentSecretNames(PRODUCTION_ENVIRONMENT));
  const permissionsP = read(() => reader.getWorkflowPermissions());
  const byRefP = read(() => reader.listDeployments({
    ref: options.defaultBranch
  }));
  const markerP = read(() => reader.getTagRef(PRODUCTION_MARKER_TAG));
  const filesAt = (ref) => Promise.all(names.map((n) => read(() => reader.getFile(CALLER_FILES[n], ref))));
  const stagingFilesP = filesAt(options.stagingBranch);
  const productionFilesP = options.defaultBranch === options.stagingBranch ? stagingFilesP : filesAt(options.defaultBranch);
  const rules = await rulesP;
  const rulesetIds = rules.kind === "ok" ? [
    ...new Set(rules.value.flatMap((r) => r.type === "pull_request" && r.ruleset_id !== void 0 ? [
      r.ruleset_id
    ] : []))
  ] : [];
  const rulesetsP = Promise.all(rulesetIds.map((id) => read(() => reader.getRuleset(id))));
  const production = await productionP;
  const headSha = production.kind === "ok" ? production.value.headSha : null;
  const bySha = headSha ? await read(() => reader.listDeployments({
    sha: headSha
  })) : null;
  const rulesetOutcomes = await rulesetsP;
  const rulesets = new Map(rulesetIds.map((id, i) => [
    id,
    rulesetOutcomes[i]
  ]));
  const asCallers = (f) => ({
    production: f[0],
    staging: f[1],
    rollback: f[2]
  });
  const analysis = analyzeCallers(asCallers(await stagingFilesP));
  const productionAnalysis = options.defaultBranch === options.stagingBranch ? analysis : analyzeCallers(asCallers(await productionFilesP));
  const deployFileBranches = options.defaultBranch === options.stagingBranch ? [
    {
      branch: options.stagingBranch,
      analysis
    }
  ] : [
    {
      branch: options.defaultBranch,
      analysis: productionAnalysis,
      role: "production"
    },
    {
      branch: options.stagingBranch,
      analysis,
      role: "staging"
    }
  ];
  const byRef = await byRefP;
  return {
    staging_branch: checkStagingBranch(await stagingP, options.stagingBranch, at),
    protection: checkProtection(rules, rulesets, options.defaultBranch, at),
    deploy_files: checkDeployFilesOnBranches(deployFileBranches, at),
    production_environment: checkProductionEnvironment(await environmentP, at),
    host_key: checkHostKey(analysis, await repoSecretsP, await envSecretsP, at),
    workflow_permissions: checkWorkflowPermissions(await permissionsP, analysis, at),
    host_autodeploy_off: checkHostAutodeployOff(bySha ? [
      byRef,
      bySha
    ] : [
      byRef
    ], {
      branch: options.defaultBranch,
      headSha
    }, options.hostDeploysSince, at, {
      host: analysis.host,
      checkedFor: options.hostAccessCheckedFor ?? null
    }),
    rollback_ready: checkRollbackReady(await markerP, at)
  };
}

// supabase/functions/_shared/publish-readiness/cli.ts
var USAGE = "Usage: verify-publishing [--repo owner/name] [--staging <branch>] [--local <dir>]";
function parseArgs(argv) {
  const args = {
    staging: "staging"
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (![
      "--repo",
      "--staging",
      "--local"
    ].includes(flag)) return {
      error: `Unknown option ${flag}. ${USAGE}`
    };
    if (value === void 0 || value.startsWith("--")) return {
      error: `${flag} needs a value. ${USAGE}`
    };
    if (flag === "--repo") {
      if (!/^[\w.-]+\/[\w.-]+$/.test(value)) return {
        error: `--repo takes owner/name. ${USAGE}`
      };
      args.repo = value;
    } else if (flag === "--staging") args.staging = value;
    else args.local = value;
    i++;
  }
  return args;
}
function repoFromRemote(url) {
  const m = url.trim().match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/);
  return m ? {
    owner: m[1],
    repo: m[2]
  } : null;
}
var NO_ACCESS = "Not checked: no GitHub access";
var ACCOUNT_CANNOT_READ = "Your GitHub account can't read this; it needs admin access to the repository";
function cliReport(items, localFiles, ctx) {
  const worded = Object.fromEntries(Object.entries(items).map(([id, s]) => {
    if (s.reason === "permissions_missing") return [
      id,
      {
        ...s,
        detail: ACCOUNT_CANNOT_READ
      }
    ];
    if (!ctx.token && s.status === "unknown") return [
      id,
      {
        ...s,
        detail: NO_ACCESS
      }
    ];
    return [
      id,
      s
    ];
  }));
  const blocking = Object.entries(worded).some(([id, s]) => {
    if (NON_BLOCKING_ITEMS.includes(id)) return s.status === "red";
    if (id === "deploy_files" && s.reason === "not_merged") return false;
    if (id === "host_autodeploy_off" && s.reason === "host_access_unchecked") return false;
    return s.status === "red" || s.status === "unknown" || s.status === "yellow";
  });
  return {
    token: ctx.token ? "found" : "none",
    local_files: localFiles,
    items: worded,
    exit_code: blocking || localFiles.status !== "green" ? 1 : 0
  };
}
async function findToken(io) {
  const fromEnv = io.env.GH_TOKEN?.trim() || io.env.GITHUB_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const gh = await io.run("gh", [
    "auth",
    "token"
  ]).catch(() => ({
    code: 127,
    stdout: ""
  }));
  return gh.code === 0 && gh.stdout.trim() ? gh.stdout.trim() : null;
}
async function syntax(io, root) {
  const files = Object.values(CALLER_FILES);
  const result = await io.run("actionlint", files, {
    cwd: root
  }).catch(() => ({
    code: 127,
    stdout: ""
  }));
  if (result.code === 127) return {
    status: "skipped",
    output: "actionlint is not installed"
  };
  return result.code === 0 ? {
    status: "ok"
  } : {
    status: "errors",
    output: result.stdout.slice(0, 4e3)
  };
}
var PLACEHOLDER = /__[A-Z][A-Z0-9_]*__/;
function placeholderLeft(names, files, checkedAt) {
  for (const [i, name] of names.entries()) {
    const f = files[i];
    const found = f.kind === "ok" && f.value.text ? f.value.text.split("\n").filter((l) => !l.trimStart().startsWith("#")).join("\n").match(PLACEHOLDER) : null;
    if (found) {
      return {
        status: "red",
        reason: "invalid_file",
        detail: `${found[0]} is not replaced in ${CALLER_FILES[name]}`,
        checked_at: checkedAt
      };
    }
  }
  return null;
}
async function main(argv, io) {
  const args = parseArgs(argv);
  if ("error" in args) {
    io.write(JSON.stringify({
      error: args.error
    }, null, 2) + "\n");
    return 2;
  }
  const root = args.local ?? io.cwd;
  const remoteUrl = await io.run("git", [
    "remote",
    "get-url",
    "origin"
  ], {
    cwd: root
  }).catch(() => ({
    code: 1,
    stdout: ""
  }));
  const target = args.repo ? {
    owner: args.repo.split("/")[0],
    repo: args.repo.split("/")[1]
  } : remoteUrl.code === 0 ? repoFromRemote(remoteUrl.stdout) : null;
  if (!target) {
    io.write(JSON.stringify({
      error: `No GitHub repository found here; pass --repo owner/name. ${USAGE}`
    }, null, 2) + "\n");
    return 2;
  }
  const token = await findToken(io);
  const call = token ? {
    token,
    fetch: io.fetch,
    sleep: io.sleep
  } : null;
  let defaultBranch = null;
  if (call) {
    const repoInfo = await githubCall(call, "GET", `/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`).catch(() => null);
    const json = repoInfo?.kind === "ok" ? repoInfo.json : null;
    if (typeof json?.default_branch === "string") defaultBranch = json.default_branch;
  }
  if (!defaultBranch) {
    const head = await io.run("git", [
      "symbolic-ref",
      "--short",
      "refs/remotes/origin/HEAD"
    ], {
      cwd: root
    }).catch(() => ({
      code: 1,
      stdout: ""
    }));
    defaultBranch = head.code === 0 ? head.stdout.trim().replace(/^origin\//, "") || "main" : "main";
  }
  const remote = call ? createGithubRepoReader({
    ...call,
    owner: target.owner,
    repo: target.repo
  }) : null;
  const reader = createLocalFirstReader(remote, {
    root,
    localRef: args.staging,
    fs: io.fs
  });
  const startedAt = io.now().toISOString();
  const items = await runReadinessChecks(reader, {
    owner: target.owner,
    repo: target.repo,
    defaultBranch,
    stagingBranch: args.staging,
    startedAt
  });
  const names = Object.keys(CALLER_FILES);
  const local = await Promise.all(names.map((n) => reader.getFile(CALLER_FILES[n], args.staging)));
  const localFiles = placeholderLeft(names, local, startedAt) ?? checkDeployFilesOnBranches([
    {
      branch: args.staging,
      analysis: analyzeCallers({
        production: local[0],
        staging: local[1],
        rollback: local[2]
      })
    }
  ], startedAt);
  const report = cliReport(items, localFiles, {
    token: token !== null
  });
  io.write(JSON.stringify({
    repo: `${target.owner}/${target.repo}`,
    default_branch: defaultBranch,
    staging_branch: args.staging,
    working_tree: join2(root),
    ...report,
    syntax: await syntax(io, root)
  }, null, 2) + "\n");
  return report.exit_code;
}

// supabase/functions/_shared/publish-readiness/cli-main.ts
var run = (cmd, args, opts) => new Promise((resolve) => {
  execFile(cmd, args, {
    cwd: opts?.cwd,
    maxBuffer: 4 * 1024 * 1024
  }, (err, stdout) => {
    const code2 = err ? err.code === "ENOENT" ? 127 : Number(err.code) || 1 : 0;
    resolve({
      code: code2,
      stdout: String(stdout ?? "")
    });
  });
});
var code = await main(process.argv.slice(2), {
  env: process.env,
  cwd: process.cwd(),
  now: () => /* @__PURE__ */ new Date(),
  write: (text) => process.stdout.write(text),
  run
});
process.exitCode = code;
