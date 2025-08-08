/**
 * Árbol de decisión actualizado considerando metodologías específicas para cada fase:
 * Waterfall, Iterativo, Spiral, V-Model, DSDM, RUP, Prototipado,
 * Feature-Driven Development, Six Sigma, Scrum, Kanban, XP, Crystal, Lean.
 */
export const arbolDecision = {
  // === Fase de Análisis ===
  analisis: [
    {
      condiciones: { clienteInvolucrado: true },
      metodo: 'Prototipado',
      descripcion: 'Construcción rápida de prototipos para validar requisitos y UX.',
      pasos: [
        'Recolectar requisitos básicos',
        'Diseñar prototipo de baja fidelidad',
        'Probar con usuarios',
        'Iterar en base a feedback'
      ]
    },
    {
      condiciones: { tamañoEquipo: 'pequeño', complejidad: 'baja' },
      metodo: 'Lean Software Development',
      descripcion: 'Minimizar desperdicios y maximizar valor desde el inicio.',
      pasos: [
        'Identificar flujo de valor',
        'Eliminar actividades sin valor',
        'Entregar rápido',
        'Aprender y ajustar'
      ]
    },
    {
      condiciones: { riesgos: 'alto' },
      metodo: 'Spiral',
      descripcion: 'Modelo evolutivo centrado en la identificación y mitigación de riesgos.',
      pasos: [
        'Definir objetivos de la fase',
        'Analizar y priorizar riesgos',
        'Desarrollar prototipos mitigantes',
        'Evaluar resultados'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Waterfall',
      descripcion: 'Modelo secuencial tradicional con fases claramente definidas.',
      pasos: [
        'Recopilar requisitos completos',
        'Diseñar arquitectura y componentes',
        'Implementar según plan',
        'Realizar pruebas exhaustivas'
      ]
    }
  ],

  // === Fase de Planificación ===
  planificacion: [
    {
      condiciones: { requisitosEstables: true },
      metodo: 'Waterfall',
      descripcion: 'Planificación detallada y secuencial con entregables fijos.',
      pasos: [
        'Documentar requisitos',
        'Definir cronograma y recursos',
        'Asignar responsabilidades',
        'Validar plan con stakeholders'
      ]
    },
    {
      condiciones: { iterativo: true },
      metodo: 'Iterativo',
      descripcion: 'Plan general combinado con ciclos repetitivos de refinamiento.',
      pasos: [
        'Establecer visión de alto nivel',
        'Ejecutar ciclo iterativo',
        'Revisar entregables',
        'Ajustar plan para siguiente ciclo'
      ]
    },
    {
      condiciones: { qualityCritical: true },
      metodo: 'V-Model',
      descripcion: 'Cada fase de desarrollo corresponde a una fase de prueba equivalente.',
      pasos: [
        'Definir requisitos y criterios de aceptación',
        'Diseño de alto nivel y pruebas de integración',
        'Diseño detallado y pruebas unitarias',
        'Validación final'
      ]
    },
    {
      condiciones: { timeFixed: true },
      metodo: 'Dynamic Systems Development Method',
      descripcion: 'Enfoque ágil con tiempos y costos fijos y fuerte participación del usuario.',
      pasos: [
        'Fijar presupuesto y plazos',
        'Desarrollar en incrementos cortos',
        'Revisión continua con usuario',
        'Entrega incremental'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Rational Unified Process',
      descripcion: 'Proceso iterativo con fases Inception, Elaboration, Construction y Transition.',
      pasos: [
        'Inception: visión y alcance',
        'Elaboration: arquitectura estable',
        'Construction: desarrollo iterativo',
        'Transition: despliegue'
      ]
    }
  ],

  // === Fase de Desarrollo ===
  desarrollo: [
    {
      condiciones: { culturaColaborativa: true, entregasFrecuentes: true },
      metodo: 'Scrum',
      descripcion: 'Framework ágil con sprints, roles claros y reuniones diarias.',
      pasos: [
        'Planificar Sprint',
        'Daily Scrum',
        'Revisión de Sprint',
        'Retrospectiva'
      ]
    },
    {
      condiciones: { flujoContinuo: true },
      metodo: 'Kanban',
      descripcion: 'Visualiza el flujo de trabajo y limita el WIP para optimizar el proceso.',
      pasos: [
        'Crear tablero Kanban',
        'Establecer límites WIP',
        'Monitorizar flujo',
        'Mejorar cuellos de botella'
      ]
    },
    {
      condiciones: { calidadCodigoAlta: true },
      metodo: 'Extreme Programming',
      descripcion: 'Prácticas técnicas como TDD y pair programming para alta calidad.',
      pasos: [
        'Escribir tests antes de código (TDD)',
        'Programación en pareja',
        'Refactorización continua',
        'Integración continua'
      ]
    },
    {
      condiciones: { proyectoGrande: true },
      metodo: 'Feature-Driven Development',
      descripcion: 'Desarrollo guiado por características basadas en un modelo de dominio.',
      pasos: [
        'Crear modelo de dominio',
        'Planificar por feature',
        'Desarrollar feature',
        'Revisar y diseñar siguiente feature'
      ]
    },
    {
      condiciones: { tamañoEquipo: 'pequeño' },
      metodo: 'Crystal',
      descripcion: 'Familia de metodologías ligeras adaptadas al tamaño y criticidad.',
      pasos: [
        'Seleccionar variante Crystal adecuada',
        'Definir protocolos de comunicación',
        'Iteraciones cortas',
        'Mejora continua'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Lean Software Development',
      descripcion: 'Principios lean para optimizar flujo y reducir desperdicios.',
      pasos: [
        'Identificar flujo de valor',
        'Eliminar desperdicios',
        'Entregar rápido',
        'Aprender y ajustar'
      ]
    }
  ],

  // === Fase de Entrega ===
  entrega: [
    {
      condiciones: { pruebasExtensivas: true },
      metodo: 'V-Model',
      descripcion: 'Asocia cada fase de desarrollo con su fase de prueba equivalente.',
      pasos: [
        'Definir criterios de prueba',
        'Diseño de pruebas de integración',
        'Pruebas unitarias y de sistema',
        'Validación final'
      ]
    },
    {
      condiciones: { mejoraContinua: true },
      metodo: 'Six Sigma',
      descripcion: 'Metodología de mejora continua enfocada en la reducción de defectos.',
      pasos: [
        'Definir métricas clave',
        'Medir rendimiento',
        'Analizar causas raíz',
        'Implementar mejoras'
      ]
    },
    {
      condiciones: { usuarioActivo: true },
      metodo: 'Dynamic Systems Development Method',
      descripcion: 'Despliegue iterativo con feedback frecuente de usuarios.',
      pasos: [
        'Desplegar incremento funcional',
        'Validar con usuario',
        'Ajustar prioridades',
        'Continuar iteraciones'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Rational Unified Process',
      descripcion: 'Fase de Transition de RUP para despliegue y seguimiento.',
      pasos: [
        'Planificar transición',
        'Realizar pruebas de aceptación',
        'Desplegar en producción',
        'Monitorear y soportar'
      ]
    }
  ]
};
