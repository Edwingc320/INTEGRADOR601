<template>
  <div>

    <div style="margin-bottom: 1rem;">
      <button :class="{ active: reporteSeleccionado === 'pago' }" @click="seleccionarReporte('pago')">
        Reportes de Pago
      </button>
      <button :class="{ active: reporteSeleccionado === 'ocupacion' }" @click="seleccionarReporte('ocupacion')">
        Reportes de Ocupación
      </button>
    </div>

    <div v-if="loading">Cargando...</div>

    <!-- Tabla pagos -->
    <div v-if="reporteSeleccionado === 'pago' && pagos.length > 0">
      <h3>Reportes de Pago</h3>
      <table>
        <thead>
          <tr>
            <th>Pago ID</th>
            <th>Cliente ID</th>
            <th>Ocupacion ID</th>
            <th>Tipo</th>
            <th>Referencia</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pago in pagosOrdenadosPaginados" :key="pago.id_pago">
            <td>{{ pago.id_pago }}</td>
            <td>{{ pago.id_cliente }}</td>
            <td>{{ pago.id_ocupacion }}</td>
            <td>{{ pago.tipo }}</td>
            <td>{{ pago.referencia }}</td>
            <td>{{ "$" + pago.monto }}</td>
            <td>{{ formatDate(pago.fecha_pago) }}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <button :disabled="paginaPago === 1" @click="paginaPago--">Anterior</button>
        Página {{ paginaPago }} de {{ totalPaginasPago }}
        <button :disabled="paginaPago === totalPaginasPago" @click="paginaPago++">Siguiente</button>
      </div>

      <h4>Ingresos por Mes/Año</h4>
      <canvas id="chartPagos"></canvas>
      <button @click="generarPDFPagos">Descargar PDF Pagos</button>

    </div>

    <!-- Tabla ocupacion -->
    <div v-if="reporteSeleccionado === 'ocupacion' && ocupacion.length > 0">
      <h3>Reportes de Ocupación</h3>
      <table>
        <thead>
          <tr>
            <th>ID Ocupación</th>
            <th>Carro</th>
            <th>Cajón</th>
            <th>Fecha Entrada</th>
            <th>Fecha Salida</th>
            <th>Fecha Reservación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="oc in ocupacionOrdenadosPaginados" :key="oc.id_ocupacion">
            <td>{{ oc.id_ocupacion }}</td>
            <td>{{ oc.id_carro }}</td>
            <td>{{ oc.id_cajon }}</td>
            <td>{{ formatDate(oc.hora_entrada) }}</td>
            <td>{{ formatDate(oc.hora_salida) }}</td>
            <td>{{ oc.fecha_reservacion}}</td>

          </tr>
        </tbody>
      </table>

      <div>
        <button :disabled="paginaOcupacion === 1" @click="paginaOcupacion--">Anterior</button>
        Página {{ paginaOcupacion }} de {{ totalPaginasOcupacion }}
        <button :disabled="paginaOcupacion === totalPaginasOcupacion" @click="paginaOcupacion++">Siguiente</button>
      </div>

      <h4>Ocupación por Mes/Año</h4>
      <canvas id="chartOcupacion"></canvas>
      <button @click="generarPDFOcupacion">Descargar PDF Ocupación</button>

    </div>

    <div
      v-if="!loading &&
        ((reporteSeleccionado === 'pago' && pagos.length === 0) ||
        (reporteSeleccionado === 'ocupacion' && ocupacion.length === 0))"
    >
      No hay datos para mostrar.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const pagos = ref([])
const ocupacion = ref([])
const loading = ref(false)
const reporteSeleccionado = ref('pago')

const paginaPago = ref(1)
const paginaOcupacion = ref(1)
const elementosPorPagina = 10

let chartPagos = null
let chartOcupacion = null

const fetchPagos = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/pagos')
    if (!res.ok) throw new Error('Error al cargar pagos')
    const data = await res.json()
    pagos.value = data.data || data
    ordenarPagos()
    crearGraficaPagos()
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    pagos.value = []
  }
  loading.value = false
}

const fetchOcupacion = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/ocupaciones/')
    if (!res.ok) throw new Error('Error al cargar ocupaciones')
    const data = await res.json()
    ocupacion.value = data.data || data
    ordenarOcupacion()
    crearGraficaOcupacion()
  } catch (error) {
    console.error('Error al obtener ocupación:', error)
    ocupacion.value = []
  }
  loading.value = false
}

const seleccionarReporte = (tipo) => {
  reporteSeleccionado.value = tipo
}

watch(reporteSeleccionado, (nuevo) => {
  if (nuevo === 'pago') {
    fetchPagos()
  } else if (nuevo === 'ocupacion') {
    fetchOcupacion()
  }
})

const ordenarPagos = () => {
  pagos.value.sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago))
  paginaPago.value = 1
}

const ordenarOcupacion = () => {
  ocupacion.value.sort((a, b) => new Date(b.hora_entrada) - new Date(a.hora_entrada))
  paginaOcupacion.value = 1
}

// Computed pagos
const pagosOrdenadosPaginados = computed(() => {
  const start = (paginaPago.value - 1) * elementosPorPagina
  const end = start + elementosPorPagina
  return pagos.value.slice(start, end)
})
const totalPaginasPago = computed(() => Math.ceil(pagos.value.length / elementosPorPagina))

// Computed ocupación
const ocupacionOrdenadosPaginados = computed(() => {
  const start = (paginaOcupacion.value - 1) * elementosPorPagina
  const end = start + elementosPorPagina
  return ocupacion.value.slice(start, end)
})
const totalPaginasOcupacion = computed(() => Math.ceil(ocupacion.value.length / elementosPorPagina))

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

const generarPDFPagos = () => {
  const doc = new jsPDF()

  doc.text('Reporte de Pagos', 14, 10)

  const data = pagosOrdenadosPaginados.value.map(p => [
    `$${parseFloat(p.monto).toFixed(2)}`,
    formatDate(p.fecha_pago),
         p.tipo,
      p.referencia
  ])

  autoTable(doc, {
    head: [['Monto', 'Fecha', 'Tipo', 'Referencia']],
    body: data,
    startY: 20,
  })

  doc.save('reporte_pagos.pdf')
}

const generarPDFOcupacion = () => {
  const doc = new jsPDF()

  doc.text('Reporte de Ocupación', 14, 10)

  const data = ocupacionOrdenadosPaginados.value.map(o => [
    o.id_carro,
    o.id_cajon,
    formatDate(o.hora_entrada),
    formatDate(o.hora_salida),
    o.fecha_reservacion
  ])

  autoTable(doc, {
    head: [['Carro', 'Cajón', 'Entrada', 'Salida', 'Reservación']],
    body: data,
    startY: 20,
  })

  doc.save('reporte_ocupacion.pdf')
}


const crearGraficaPagos = async () => {
  await nextTick()
  const ingresosPorMes = {}

  pagos.value.forEach((p) => {
    const date = new Date(p.fecha_pago)
    const key = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
    ingresosPorMes[key] = (ingresosPorMes[key] || 0) + parseFloat(p.monto)
  })

  const labels = Object.keys(ingresosPorMes).sort()
  const data = labels.map((l) => ingresosPorMes[l])

  if (chartPagos) chartPagos.destroy()

  const ctx = document.getElementById('chartPagos').getContext('2d')
  chartPagos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ingresos por Mes',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Monto' } },
        x: { title: { display: true, text: 'Mes/Año' } },
      },
    },
  })
}

const crearGraficaOcupacion = async () => {
  await nextTick()
  const ocupacionPorMes = {}

  ocupacion.value.forEach((o) => {
    const date = new Date(o.hora_entrada)
    const key = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
    ocupacionPorMes[key] = (ocupacionPorMes[key] || 0) + 1
  })

  const labels = Object.keys(ocupacionPorMes).sort()
  const data = labels.map((l) => ocupacionPorMes[l])

  if (chartOcupacion) chartOcupacion.destroy()

  const ctx = document.getElementById('chartOcupacion').getContext('2d')
  chartOcupacion = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Ocupación por Mes',
        data,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: true,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Número de ocupaciones' } },
        x: { title: { display: true, text: 'Mes/Año' } },
      },
    },
  })
}

// Llamar reporte inicial en onMounted
onMounted(() => {
  fetchPagos()
})
</script>

<style scoped>
button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button.active {
  background-color: #3498db;
  color: white;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th,
td {
  border: 1px solid #818181;
  padding: 0.5rem;
  text-align: center;
}

th {
  background-color: #818181;
}
</style>
