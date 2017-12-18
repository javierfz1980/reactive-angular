# WebSocket messages
Es una API mockeada que permite simular un servicio de conexion directo para recibir alertas. El servicio esta preparado para enviar alertas en una cantidad de enre 0 y 3 cada 10 segundos.


```
ws://localhost:3002/
```
## Alertas
>```JSON
>{
>   "type": "MESSAGE_RECIEVED",
>   "from": String,
>   "email": String,
>   "date": String,
>   "message": String
>}
>```


