export function crearSesion(token, data) {
  localStorage.setItem('V0', token)
  localStorage.setItem('V1', JSON.stringify(data))
}

export function eliminarSesion() {
  localStorage.removeItem('V0')
  localStorage.removeItem('V1')
}

export function obtenerSesion() {
  return localStorage.getItem('V0')
}

export function obtenerDatosSesion() {
  const data = localStorage.getItem('V1')
  return JSON.parse(data)
}

export function verificarSesion() {
  const token = obtenerSesion()
  const data = obtenerDatosSesion()

  if (token) {
    let check1 = token.split('.').length == 3
    return check1 == true && data != null
  }

  return false
}
