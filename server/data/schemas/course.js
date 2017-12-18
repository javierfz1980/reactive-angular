module.exports = {
  type: 'object',
  properties: {
    course: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          faker: 'random.uuid'
        },
        title: {
          type: 'string',
          faker: 'lorem.sentence'
        },
        short_description: {
          type: 'string',
          faker: 'lorem.paragraph'
        },
        detail: {
          type: 'string',
          faker: 'lorem.paragraphs'
        },
        active: {
          type: 'boolean',
          faker: 'random.boolean'
        }
      },
      required: ['id', 'title', 'short_description', 'detail', 'active']
    }
  },
  required: ['course']
};