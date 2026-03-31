const request = require('supertest');
const app = require('./index');

describe('Healthcare API', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'UP');
  });

  it('should get all patients', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('x-user-role', 'doctor');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should add a new patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('x-user-role', 'admin')
      .send({
        name: 'Alice Brown',
        age: 28,
        condition: 'Stable'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Alice Brown');
  });

  it('should fail if unauthorized role tries to add patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('x-user-role', 'doctor')
      .send({
        name: 'Unauthorized Patient',
        age: 30,
        condition: 'Critical'
      });
    expect(res.statusCode).toEqual(403);
  });

  it('should fail on invalid input', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        name: '',
        age: -5,
        condition: ''
      });
    expect(res.statusCode).toEqual(400);
  });
});
