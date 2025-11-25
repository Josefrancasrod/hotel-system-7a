const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeRefreshToken
} = require('../../Services/UserServices');
console.log('\n PRUEBAS DE AUTENTICACIÓN JWT\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`✓ ${name}`);
  } catch (error) {
    testsFailed++;
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

// Generar access token
test('1. Genera access token válido', () => {
  const token = generateAccessToken({ 
    userId: '123', 
    email: 'test@hotel.com', 
    role: 'user' 
  });
  if (!token) throw new Error('No generó access token');
  console.log(`   Token: ${token.substring(0, 50)}...`);
});

// Generar refresh token
test('2. Genera refresh token válido', () => {
  const token = generateRefreshToken({ 
    userId: '123', 
    email: 'test@hotel.com' 
  });
  if (!token) throw new Error('No generó refresh token');
  console.log(`   Token: ${token.substring(0, 50)}...`);
});

// Verificar access token
test('3. Verifica access token válido', () => {
  const token = generateAccessToken({ 
    userId: '1', 
    email: 'test@hotel.com', 
    role: 'user' 
  });
  const decoded = verifyAccessToken(token);
  if (decoded.type !== 'access') throw new Error('Tipo incorrecto');
  console.log(`   Verificado: userId=${decoded.userId}`);
});

// Verificar refresh token
test('4. Verifica refresh token válido', () => {
  const token = generateRefreshToken({ 
    userId: '1', 
    email: 'test@hotel.com' 
  });
  const decoded = verifyRefreshToken(token);
  if (decoded.type !== 'refresh') throw new Error('Tipo incorrecto');
  console.log(`   Verificado: tokenId=${decoded.tokenId}`);
});

// Renovar tokens
test('5. Renueva tokens correctamente', () => {
  const refreshToken = generateRefreshToken({ 
    userId: '123', 
    email: 'test@hotel.com' 
  });
  const renewed = refreshAccessToken(refreshToken);
  if (!renewed.accessToken) throw new Error('No renovó');
  console.log(`   Renovado exitosamente`);
});

// Rechazar token inválido
test('6. Rechaza token inválido', () => {
  try {
    verifyAccessToken('token.invalido.xyz');
    throw new Error('No rechazó token inválido');
  } catch (error) {
    if (error.message === 'No rechazó token inválido') throw error;
  }
  console.log(`   Token inválido rechazado`);
});

// Revocar token
test('7. Revoca refresh token', () => {
  const token = generateRefreshToken({ userId: '999', email: 'test@test.com' });
  revokeRefreshToken(token);
  try {
    verifyRefreshToken(token);
    throw new Error('No revocó el token');
  } catch (error) {
    if (error.message === 'No revocó el token') throw error;
  }
  console.log(`   Token revocado correctamente`);
});

// Validar tipos de token
test('8. No acepta refresh como access token', () => {
  const refreshToken = generateRefreshToken({ userId: '1', email: 'test@hotel.com' });
  try {
    verifyAccessToken(refreshToken);
    throw new Error('Aceptó tipo incorrecto');
  } catch (error) {
    if (error.message === 'Aceptó tipo incorrecto') throw error;
  }
  console.log(`   Validación de tipos correcta`);
});

// Flujo completo
test('9. INTEGRACIÓN: Flujo completo', () => {
  const access = generateAccessToken({ userId: 'u1', email: 'test@h.com', role: 'admin' });
  const refresh = generateRefreshToken({ userId: 'u1', email: 'test@h.com' });
  const verified = verifyAccessToken(access);
  const renewed = refreshAccessToken(refresh);
  revokeRefreshToken(renewed.refreshToken);
  console.log(`   Flujo completo OK`);
});

// Payload correcto
test('10. Tokens contienen payload correcto', () => {
  const userData = { userId: 'abc', email: 'p@t.com', role: 'admin' };
  const token = generateAccessToken(userData);
  const decoded = verifyAccessToken(token);
  if (decoded.userId !== userData.userId) throw new Error('userId no coincide');
  if (decoded.email !== userData.email) throw new Error('email no coincide');
  if (decoded.role !== userData.role) throw new Error('role no coincide');
  console.log(`   Payload verificado`);
});

console.log(`\n RESULTADOS:`);
console.log(`   Pasadas: ${testsPassed}`);
console.log(`    Fallidas: ${testsFailed}`);
console.log(`    Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log(`\Todas las pruebas pasaron\n`);
} else {
  console.log(`\n Algunas pruebas fallaron.\n`);
  process.exit(1);
}