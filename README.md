# Training de angular. Ejercicio final

El objetivo del presente ejercicio es terminar de aplicar los conceptos obtenidos a lo largo del curos, en una app basica corriendo sobre angular.

El repositorio provee una api local que sirve distintos endpoints que sirven datos para lograr cumplir los requerimientos funcionales.



# API local

```
$ cd server
$ npm start
```
Corriendo el start del server, van a arrancar dos server localhost corriendo en dos puertos:

* `3001` La API rest mockeada local
* `3002` El servicio de mensajes por websocket

# Documentacion de APIs
- [API REST](./API.md)
- [API WebSocket](./WS.md)


# Requerimientos funcionales
El look and feel es totalmente a criterio personal. Se sugiere tener una libreria base como material o bootstrap. Se pide el siguiente soporte en cuanto a usabilidad
- Pagina inicial de LOGIN con campos de user y password.
- Dashboard / Home
- 3 secciones de contenido
- 1 header con las siguientes: usuario y alertas


### LOGIN
La pagina de login sera vista cuando el usuario arranque el flujo. No debe mostrarse si el usurio ya se encuentra logueado.

### HOME / DASHBOARD
Se debe mostrar la home separada en 4 cuadrantes cada uno con una estadistica y un link puntual
* `Cantidad de cursos activos` - link a cursos
* `Cantidad de alumnos` - link a directiorio de alumnos
* `Cantidad de profesores` - link a directorio de profesores
* `Nombre del curso con mas inscriptos` - link al detalle del curso

### SECCIONES
El usuario debe poder navegar a 4 secciones distintas: `Cursos`, `Alumnos`, `Profesores`

#### SECCION : Cursos
Es una grilla responsiva que presenta `titulo` y `descripcion`. Cada celda de la grilla linkea al detalle del curso. Los cursos que no se encuentran activos deben estar visualmente indicados / flagueados

El detalle del curso debe mostrar la informacion del curso, nombre del profesor (link al perfil) y una seccion expandible que muestre los inscripton. (estas dos ultimas si el curso esta activo)

**Extra Points - Solo para rol de ADMINISTRADOR**: Poder editar la informacion del curso, asi tambien como agregar o eliminar inscriptos / seleccionar el profesor / deshabilitar el curso

#### SECCION : Alumnos
Listado de alumnos del sistema con nombre e email. La celda debe linkear el detalle del alumno.

El detalle del alumno debe presentar toda la informacion del mismo asi tambien como el listado a los cursos donde se encuentra inscripto.

**Extra Points - Solo para rol de ADMINISTRADOR**: Eliminar o editar el alumno. *Tener en cuenta la division de entidades entre alumno y perfil*.

#### SECCION : Profesores
Listado de profesores del sistema con nombre e email. La celda debe linkear el detalle del profesor

El detalle del profesor debe presentar toda la informacion del mismo asi tambien como el listado de los cursos que dicta.

**Extra Points - Solo para rol de ADMINISTRADOR**: Eliminar o editar el profesor. *Tener en cuenta la division de entidades entre profesor y perfil*.

### HEADER
En el header debe darse la posibilidad al usuario de realizar acciones relacionadas a su cuenta, con alertas recibidas y un search

#### HEADER: USUARIO
Debe presentarse un icono clickeable que despliege 2 opciones:
- LOGOUT: al clickear el user va a la pagina de login
- CUENTA: al clickearlo el user va a la pagina con informacion de su cuenta

#### HEADER: ALERTAS
El usuario luego de loguearse debe empezar a recibir alertas. Dichas alertas seran mostradas en un dropdown donde se muestra el titulo unicamente. Todas las alertas que se reciban deben ir apilandose en ese dropdown. El icono de alertas debe tener un contador de alertas NO LEIDAS. Las alertas leidas / no leidas deben tener alguna variacion visual. Las alertas NO LEIDAS son las que nunca se clickearon. Al clickear se abre el detalle del alerta en un modal y se marca como leida

#### HEADER: Search
El header debe tener un input de search donde el usuario pueda hacer input de un string y el sistema debe buscar matchings contra Alumnos, Profesores y Cursos. El resultado puede mostrarse de cualquiera de las siguientes dos maneras
- Lista de autocomplete con organizacion de -hasta- los tres grupos
- Pagina nueva a la que se navega cuando se hace click en buscar o 'enter'. La pagina tiene que estar organizada para mostrar los resultados de los tres grupos. Esta pagina tiene que poder ser bookmarkeable.

# Requerimientos técnicos
- Utilizar Angular CLI (app name = `gl-angular-training` / prefix `gl`)
- Las 3 secciones principales deben ser modulos de carga lazy.
- El acceso a las secciones debe estar validado para usuarios logueados
- Cualquier extra point relacionado a carga / modificacion / borrado de datos debe estar validado solo para usuarios con rol de `administrador`

# Proceso
- Hacer fork de este repositorio
- Utilizar la carpeta `.client` para generar y desarrollar la app de angular
- Pushear y comitear a gitlab-art bajo su user. Darle sentido a los mensajes de commits (https://chris.beams.io/posts/git-commit/)