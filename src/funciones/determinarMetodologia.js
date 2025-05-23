const determinarMetodologia = ({ tamanio, complejo, cliente, iterativo, tipo }) => {
    // Si el proyecto es de software, se aplican reglas basadas en metodologías ágiles o planificadas
    if (tipo === "software") {
      if (iterativo === "si") {
        // Proyectos ágiles con iteración
        if (cliente === "si") {
          // Con alta participación del cliente
          if (complejo === "si") {
            // Proyectos complejos
            if (tamanio === "grande") {
              return "Scrum"; // Para proyectos grandes, complejos y con fuerte involucramiento del cliente
            } else if (tamanio === "mediano") {
              return "XP"; // Para proyectos medianos donde la calidad y la comunicación son claves
            } else {
              return "Kanban"; // Para proyectos pequeños, donde la flexibilidad es fundamental
            }
          } else {
            // No tan complejos
            if (tamanio === "grande") {
              return "Scrum"; // Incluso sin alta complejidad, un proyecto grande se beneficia de una estructura ágil
            } else {
              return "Kanban"; // Proyectos pequeños o medianos con cliente activo pero simples se adaptan bien a Kanban
            }
          }
        } else {
          // Sin la presencia activa del cliente
          if (complejo === "si") {
            return "RUP"; // RUP puede ayudar en entornos complejos con menor comunicación directa
          } else {
            return "Kanban"; // Proyectos simples sin cliente activo se benefician de la flexibilidad de Kanban
          }
        }
      } else {
        // Proyectos de software no iterativos (más planificados)
        if (complejo === "si") {
          if (tamanio === "grande") {
            return "Modelo en V"; // Proyectos grandes y complejos se adaptan a modelos estructurados y secuenciales
          } else {
            return "Cascada"; // Proyectos más pequeños y complejos sin iteración se benefician de una planificación secuencial
          }
        } else {
          return "Cascada"; // Proyectos simples y planificados se pueden gestionar con el modelo en cascada
        }
      }
    } 
    // Proyectos que no son de software
    else {
      if (tamanio === "grande" || complejo === "si") {
        return "PMBOK"; // Para proyectos grandes o complejos se recomienda un enfoque formal de gestión de proyectos
      } else {
        return "Lean"; // Para proyectos pequeños y menos complejos se opta por metodologías más ágiles y flexibles
      }
    }
  };
  
export default determinarMetodologia;
  
  