'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqCategories = [
    {
        title: "Reservas y Pagos",
        items: [
            {
                question: "¿Cómo puedo reservar?",
                answer: "Puedes reservar directamente por Airbnb o escribirnos por chat para recibir un presupuesto personalizado."
            },
            {
                question: "¿Tengo que reservar sí o sí por Airbnb?",
                answer: "No. Airbnb es una opción, pero también puedes reservar consultando por chat."
            },
            {
                question: "¿Cómo es la reserva por chat?",
                answer: "Nos indicas fechas y cantidad de personas, te enviamos un presupuesto y coordinamos la reserva."
            },
            {
                question: "¿Cómo se realiza el pago?",
                answer: "Las reservas por Airbnb se pagan dentro de la plataforma. En reservas por chat, el método de pago se informa junto con el presupuesto."
            },
            {
                question: "¿Puedo cancelar la reserva?",
                answer: "Sí. En Airbnb rige la política publicada. En reservas por chat, las condiciones se informan previamente."
            },
            {
                question: "¿Es seguro reservar?",
                answer: "Sí. Recomendamos siempre usar los canales oficiales y no realizar pagos fuera de los métodos acordados."
            }
        ]
    },
    {
        title: "Tu Estadía y Servicios",
        items: [
            {
                question: "¿Qué incluye el precio?",
                answer: "Incluye el alojamiento y los servicios detallados en la ficha de la propiedad. No hay costos ocultos."
            },
            {
                question: "¿Cuáles son los horarios de check-in y check-out?",
                answer: "Los horarios están indicados en la ficha del alojamiento y pueden variar según disponibilidad."
            },
            {
                question: "¿Cómo se ingresa al alojamiento?",
                answer: "El acceso puede ser con llaves o cerradura digital. Las instrucciones se envían antes de la llegada."
            },
            {
                question: "¿El alojamiento tiene Wi-Fi?",
                answer: "Sí, si está incluido, los datos de acceso se entregan al momento del ingreso."
            },
            {
                question: "¿Pueden alojarse más personas o recibir visitas?",
                answer: "Depende de la capacidad y las normas del alojamiento, indicadas en la ficha."
            },
            {
                question: "¿Qué hago si tengo un problema durante la estadía?",
                answer: "Contáctanos por el mismo canal por el que realizaste la reserva y te ayudamos."
            },
            {
                question: "¿Dónde veo toda la información del alojamiento?",
                answer: "En la ficha de la propiedad, donde se detallan servicios, normas y características."
            }
        ]
    }
]

export default function FAQ() {
    // Store the ID of the open item as "categoryIndex-itemIndex"
    const [openId, setOpenId] = useState<string | null>(null)

    const toggle = (catIndex: number, itemIndex: number) => {
        const id = `${catIndex}-${itemIndex}`
        setOpenId(openId === id ? null : id)
    }

    return (
        <div className="mt-16 w-full max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center px-4">Preguntas Frecuentes</h3>

            <div className="space-y-10 px-4">
                {faqCategories.map((category, catIndex) => (
                    <div key={catIndex}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-8 w-1 bg-primary-500 rounded-full"></div>
                            <h4 className="text-xl font-bold text-gray-900">{category.title}</h4>
                        </div>

                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => {
                                const isOpen = openId === `${catIndex}-${itemIndex}`
                                return (
                                    <div
                                        key={itemIndex}
                                        className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => toggle(catIndex, itemIndex)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="p-4 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/30">
                                                {item.answer}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
