module.exports = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          faker: 'random.uuid'
        },
        first_name: {
          type: 'string',
          faker: 'name.firstName'
        },
        last_name: {
          type: 'string',
          faker: 'name.lastName'
        },
        email: {
          type: 'string',
          format: 'email',
          faker: 'internet.email'
        }
      },
      required: ['id', 'first_name', 'last_name', 'email']
    }
  },
  required: ['user']
};