
const knownPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

function modInverse(a, m) {
  a = (a % m + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
}

function generatePrime() {
  const isPrime = num => {
    for (let i = 2; i < num; i++)
      if (num % i === 0) return false;
    return num !== 1;
  };

  let candidate = Math.floor(Math.random() * 100) + 50;
  while (!isPrime(candidate)) {
    candidate++;
  }

  return candidate;
}

function generateRSAKeys(bits) {
  const knownPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

  let p, q;
  do {
    p = generatePrime();
    q = generatePrime();
  } while (p === q);

  const n = p * q;
  const euler = (p - 1) * (q - 1);

  let e;
  let i = 0;
  do {
    e = knownPrimes[i];
    i += 1;
  } while (euler % e === 0);

  const d = modInverse(e, euler);

  console.log('p:', p);
  console.log('q:', q);

  return { publicKey: { e, n }, privateKey: { d, n } };
}

function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  const encryptedMessage = [];

  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const encryptedCharCode = BigInt(charCode) ** BigInt(e) % BigInt(n);
    encryptedMessage.push(encryptedCharCode.toString());
  }

  return encryptedMessage.join(' ');
}

function decrypt(encryptedMessage, privateKey) {
  const { d, n } = privateKey;
  const decryptedMessage = encryptedMessage.split(' ').map(char => {
    const decryptedCharCode = BigInt(char) ** BigInt(d) % BigInt(n);
    return String.fromCharCode(Number(decryptedCharCode.toString()));
  }).join('');

  return decryptedMessage;
}

const message = 'Print';
const keys = generateRSAKeys();

console.time('Encryption Time');
const encryptedMessage = encrypt(message, keys.publicKey);
console.timeEnd('Encryption Time');

console.time('Decryption Time');
const decryptedMessage = decrypt(encryptedMessage, keys.privateKey);
console.timeEnd('Decryption Time');

console.log('Original message:', message);
console.log('Public Key:', keys.publicKey);
console.log('Private Key:', keys.privateKey);
console.log('Encrypted message:', encryptedMessage);
console.log('Decrypted message:', decryptedMessage);

