module.exports = {
  type: 'object',
  properties: {
    profile: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          faker: 'random.uuid'
        },
        contact: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
              faker: 'address.streetName'
            },
            state: {
              type: 'string',
              faker: 'address.state'
            },
            city: {
              type: 'string',
              faker: 'address.city'
            },
            country: {
              type: 'string',
              faker: 'address.country'
            },
            zip: {
              type: 'string',
              faker: 'address.zipCode'
            },
            phone: {
              type: 'string',
              faker: 'phone.phoneNumber'
            }
          },
          required: ['street','state', 'country', 'city', 'zip', 'phone']
        },
        birthday: {
          type: 'string',
          faker: 'date.past'
        },
        avatar: {
          type: 'string',
          faker: 'image.avatar'
        },
        secondary_email: {
          type: 'string',
          format: 'email',
          faker: 'internet.email'
        }
      },
      required: ['id', 'contact', 'birthday']
    }
  },
  required: ['profile']
};