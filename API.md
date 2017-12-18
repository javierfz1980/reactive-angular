# API Rest
Es una API mockeada con datos e implementación basicos pero que contiene los suficientes endpoints y data para podes cumplir con los requerimientos funcionales.


***
## Endpoints - Sessions
***
```
POST http://localhost:3001/login
```
##### Parameters - body json
| name     | value  | notes                                      |
| -------- | ------ | ------------------------------------------ |
| username | email  | *cualquier string en formato email*        |
| password | string | *cualquier string, no hay validacion real* |

##### Retorna
>```JSON
>{
>  "token": TOKEN
>}
>```

**Las apis que estan marcadas con `Requiere Token Header` refieren a que la api hace una validacion basica donde espera un HEADER de nombre `token` con el valor devuelto por esta api**

```
GET http://localhost:3001/account
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>{
>  "name": "John Doe",
>  "email": "john@doe",
>  "role": "administrator"
>}
>```

***
## Endpoints - Cursos
***
```
GET http://localhost:3001/courses
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
| query   |  String | value to do a lookup on `title` and `short_description` |

##### Retorna
>```JSON
>[
>  {
>     "id": UUID,
>     "title": String,
>     "short_description": String,
>     "detail": String,
>     "active": Boolean,
>     "teacher": UUID,
>     "students": [
>       UUID,
>       ...
>     ]
>  }
>  ...
>]
>```

```
GET http://localhost:3001/courses/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "title": String,
>     "short_description": String,
>     "detail": String,
>     "active": Boolean,
>     "teacher": UUID,
>     "students": [
>       UUID,
>       ...
>     ]
>  }
>```

`teacher` *Solo si el curso esta activo*
`students` *Solo si el curso esta activo, pero opcional*

```
DELETE http://localhost:3001/courses/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "message": "The resource was deleted"
>  }
>```

```
POST http://localhost:3001/courses/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   title  | String |       |
|   short_description  |  String  |       |
|   detail  |   String   |       |
|   active  | Boolean |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "title": String,
>     "short_description": String,
>     "detail": String,
>     "active": Boolean
>  }
>```

```
PATCH http://localhost:3001/courses/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   PROP   | PROP VALUE |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "title": String,
>     "short_description": String,
>     "detail": String,
>     "active": Boolean
>  }
>```

***
## Endpoints - Profesores
***
```
GET http://localhost:3001/teachers
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
| query   |  String | value to do a lookup on `first_name` and `last_name` |

##### Retorna
>```JSON
>[
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID
>  }
>  ...
>]
>```

```
GET http://localhost:3001/teachers/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID
>  }
>```


```
DELETE http://localhost:3001/teachers/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "message": "The resource was deleted"
>  }
>```

```
POST http://localhost:3001/teachers/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   first_name  | String |       |
|   last_name  |  String  |       |
|   email  |   String   |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID
>  }
>```

```
PATCH http://localhost:3001/teachers/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   PROP   | PROP VALUE |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID
>  }
>```

***
## Endpoints - Alumnos
***

```
GET http://localhost:3001/students
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
| query   |  String | value to do a lookup on `first_name` and `last_name` |

##### Retorna
>```JSON
>[
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID,
>     "courses": [
>         UUID
>     ]
>   }
>  ...
>]
>```

`courses` *Solo si esta asignado a un curso*

```
GET http://localhost:3001/students/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID,
>     "courses": [
>         UUID
>     ]
>  }
>```

`courses` *Solo si esta asignado a un curso*

```
DELETE http://localhost:3001/students/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "message": "The resource was deleted"
>  }
>```

```
POST http://localhost:3001/students/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   first_name  | String |       |
|   last_name  |  String  |       |
|   email  |   String   |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String
>  }
>```

```
PATCH http://localhost:3001/students/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   PROP   | PROP VALUE |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "first_name": String,
>     "last_name": String,
>     "email": String,
>     "profile_id": UUID
>  }
>```

***
## Endpoints - Perfiles
***

```
GET http://localhost:3001/profiles
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>[
>  {
>     "id": UUID,
>     "contact": {
>         "street": String,
>         "state": String,
>         "country": String,
>         "city": String,
>         "zip": String,
>         "phone": Strong
>     },
>     "birthday": String
>   }
>  ...
>]
>```

```
GET http://localhost:3001/profiles/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "contact": {
>         "street": String,
>         "state": String,
>         "country": String,
>         "city": String,
>         "zip": String,
>         "phone": Strong
>     },
>     "birthday": String
>   }
>```

`courses` *Solo si esta asignado a un curso*

```
DELETE http://localhost:3001/profiles/{ID}
```
`Requiere Token Header`

##### Parameters
|   name   | value  | notes |
| -------- | ------ | ----- |
|          |        |       |

##### Retorna
>```JSON
>  {
>     "message": "The resource was deleted"
>  }
>```

```
POST http://localhost:3001/profiles/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   contact.street  | String |       |
|   contact.state  |  String  |       |
|   contact.country  |   String   |       |
|   contact.city  |   String   |       |
|   contact.zip  |   String   |       |
|   contact.phone  |   String   |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "contact": {
>         "street": String,
>         "state": String,
>         "country": String,
>         "city": String,
>         "zip": String,
>         "phone": Strong
>     },
>     "birthday": String
>   }
>```

```
PATCH http://localhost:3001/students/
```
`Requiere Token Header`

##### Parameters - body json
|   name   | value  | notes |
| -------- | ------ | ----- |
|   PROP   | PROP VALUE |       |

##### Retorna
>```JSON
>  {
>     "id": UUID,
>     "contact": {
>         "street": String,
>         "state": String,
>         "country": String,
>         "city": String,
>         "zip": String,
>         "phone": Strong
>     },
>     "birthday": String
>   }
>```