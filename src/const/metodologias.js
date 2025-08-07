// src/const/metodologias.js

/**
 * Árbol de decisión para recomendar una metodología específica en cada fase.
 * Cada fase incluye reglas basadas en criterios clave, seguidas de una regla
 * fallback genérica al final para garantizar siempre una recomendación.
 */
export const arbolDecision = {
  // === Fase de Análisis ===
  analisis: [
    {
      condiciones: { tamañoEquipo: 'pequeño', complejidad: 'baja', clienteInvolucrado: false },
      metodo: 'Lean Startup',
      descripcion: 'Validación rápida de hipótesis usando MVP y ciclos Build-Measure-Learn.',
      pasos: [
        'Definir hipótesis de valor',
        'Construir MVP (Producto Mínimo Viable)',
        'Medir métricas clave',
        'Aprender y pivotar'
      ]
    },
    {
      condiciones: { tamañoEquipo: 'mediano', complejidad: 'media', clienteInvolucrado: true },
      metodo: 'Design Thinking',
      descripcion: 'Enfoque centrado en el usuario para empatizar y prototipar soluciones.',
      pasos: [
        'Empatizar con los usuarios',
        'Definir necesidades clave',
        'Idear múltiples soluciones',
        'Prototipar la más prometedora',
        'Testear con usuarios'
      ]
    },
    {
      condiciones: { tamañoEquipo: 'grande', complejidad: 'alta' },
      metodo: 'Scrum',
      descripcion: 'Framework ágil con sprints iterativos y roles definidos.',
      pasos: [
        'Formar equipo (Product Owner, Scrum Master, Dev Team)',
        'Crear Product Backlog con historias de usuario',
        'Planificar Sprint inicial',
        'Revisiones y refinamiento continuo'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Scrum',
      descripcion: 'Framework ágil estándar, versátil y ampliamente adoptado.',
      pasos: [
        'Establecer equipo Scrum',
        'Priorizar Product Backlog',
        'Sprint Planning',
        'Daily Scrum',
        'Sprint Review',
        'Sprint Retrospective'
      ]
    }
  ],

  // === Fase de Planificación ===
  planificacion: [
    {
      condiciones: { duracionMeses: '<=3', riesgos: 'bajo' },
      metodo: 'Prince2 Lite',
      descripcion: 'Versión simplificada de PRINCE2, adecuada para proyectos cortos y de bajo riesgo.',
      pasos: [
        'Definir caso de negocio',
        'Establecer tolerancias de tiempo y coste',
        'Plan de calidad mínimo',
        'Monitoreo de hitos clave'
      ]
    },
    {
      condiciones: { duracionMeses: '>3', riesgos: 'altos' },
      metodo: 'Waterfall',
      descripcion: 'Planificación detallada y secuencial para entornos con requisitos estables.',
      pasos: [
        'Recopilar y documentar requisitos completos',
        'Diseñar arquitectura y componentes',
        'Implementación en fases',
        'Pruebas integrales antes de avanzar'
      ]
    },
    {
      condiciones: { duracionMeses: '>6', clienteInvolucrado: true },
      metodo: 'Rolling Wave Planning',
      descripcion: 'Planificación progresiva: detallada para lo inmediato, de alto nivel para fases lejanas.',
      pasos: [
        'Plan a nivel de hitos para el proyecto completo',
        'Plan detallado para las próximas 2–3 iteraciones',
        'Revisar y actualizar plan cada ciclo',
        'Ajustes continuos según feedback'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Adaptive Project Framework (APF)',
      descripcion: 'Replanificación periódica basada en resultados y feedback real.',
      pasos: [
        'Definir alcance inicial flexible',
        'Entregas adaptativas por iteración',
        'Reevaluar y replanificar al cierre de cada iteración',
        'Cerrar proyecto cuando se alcancen objetivos'
      ]
    }
  ],

  // === Fase de Desarrollo ===
  desarrollo: [
    {
      condiciones: { integracionContinua: true, despliegueAutomatizado: true },
      metodo: 'DevOps',
      descripcion: 'Automatización de CI/CD para entregas rápidas y fiables.',
      pasos: [
        'Configurar pipelines de integración continua (CI)',
        'Automatizar pruebas unitarias y de integración',
        'Despliegues automáticos a staging/prod',
        'Monitorizar métricas de rendimiento'
      ]
    },
    {
      condiciones: { feedbackContinuo: true, culturaColaborativa: true },
      metodo: 'Extreme Programming (XP)',
      descripcion: 'Prácticas técnicas avanzadas para alta calidad de código.',
      pasos: [
        'Desarrollo basado en pruebas (TDD)',
        'Programación en pareja',
        'Integración continua diaria',
        'Refactorización continua'
      ]
    },
    {
      condiciones: { entregasFrecuentes: true, mantenimientoPrevisto: true },
      metodo: 'Kanban',
      descripcion: 'Flujo continuo visualizando y limitando trabajo en progreso.',
      pasos: [
        'Diseñar tablero Kanban con columnas clave',
        'Establecer límites de WIP',
        'Revisiones diarias del flujo',
        'Optimizar cuellos de botella'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Kanban',
      descripcion: 'Método flexible y simple para gestionar el flujo de trabajo.',
      pasos: [
        'Crear columnas To Do, Doing, Done',
        'Priorizar tareas en backlog',
        'Mover tarjetas según avance',
        'Reuniones de mejora periódicas'
      ]
    }
  ],

  // === Fase de Entrega ===
  entrega: [
    {
      condiciones: { entregasIterativas: true },
      metodo: 'Continuous Delivery',
      descripcion: 'Entrega automatizada de cambios de software con calidad garantizada.',
      pasos: [
        'Automatizar compilación y pruebas',
        'Deploy continuo a entorno de staging',
        'Validación rápida por QA',
        'Deploy on-demand a producción'
      ]
    },
    {
      condiciones: { riesgoAlto: true },
      metodo: 'Canary Release',
      descripcion: 'Despliegue gradual a un subset de usuarios para mitigar riesgos.',
      pasos: [
        'Seleccionar grupo pequeño de usuarios',
        'Desplegar nueva versión al canario',
        'Monitorizar métricas y logs',
        'Escalar despliegue si es estable'
      ]
    },
    {
      condiciones: { entregasMasivas: true },
      metodo: 'Phased Rollout',
      descripcion: 'Liberación escalonada por regiones o segmentos de usuario.',
      pasos: [
        'Definir segmentos de usuarios/zonas',
        'Desplegar en el primer segmento',
        'Monitorear rendimiento y feedback',
        'Avanzar a siguientes segmentos'
      ]
    },
    // fallback
    {
      condiciones: {},
      metodo: 'Continuous Delivery',
      descripcion: 'Enfoque por defecto para entregas rápidas y recurrentes.',
      pasos: [
        'Pipeline CI/CD completo',
        'Despliegue a staging y validación',
        'Deploy a producción',
        'Monitoreo post-release'
      ]
    }
  ]
};
