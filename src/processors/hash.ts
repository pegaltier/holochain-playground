import multihashes from "multihashes";
import { Buffer } from "buffer";

export function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function hash(content: any): string {
  const contentString =
    typeof content === "string" ? content : JSON.stringify(content);

  const encoded = multihashes.encode(
    Buffer.from(contentString, "utf-8"),
    "sha2-256"
  );
  return multihashes.toB58String(encoded);
}

function xor(a, b) {
  if (!Buffer.isBuffer(a)) a = new Buffer(a);
  if (!Buffer.isBuffer(b)) b = new Buffer(b);
  var res = [];
  if (a.length > b.length) {
    for (var i = 0; i < b.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  } else {
    for (var i = 0; i < a.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  }
  return new Buffer(res);
}

export function distance(hash1: string, hash2: string): bigint {
  const array1 = multihashes.fromB58String(hash1);
  const array2 = multihashes.fromB58String(hash2);

  const buffer = xor(array1, array2);
  console.log(buffer);

  return buffer.readBigInt64BE(0);
}

console.log(
  "hola0",
  distance("5ubUtRzQ6asWU8JWePcST7F2Rc8n2T", "5ubUtRzQ6asWU8JWePcST7F2Rc8n2T")
);
console.log(
  "hola0",
  distance("5ubUtRzQ6asWU8JWePcST7F2Rc8n1T", "5ubUtRzQ6asWU8JWePcST7F2Rc8n2T")
);
console.log(
  "hola1",
  distance("5ubUtRzQ6asWU8JWePcST7F2Rc8n2T", "1ubUtRzQ6asWU8JWePcST7F2Rc8n2T")
);
console.log(
  "hola1",
  distance("5ubUtRzQ6asWU8JWePcST7F2Rc8n2T", "5dbUtRzQ6asWU8JWePcST7F2Rc8n2T")
);
console.log(
  "hola1",
  distance("5ubUtRzQ6asWU8JWePcST7F2Rc8n2T", "5ucUtRzQ6asWU8JWePcST7F2Rc8n2T")
);
