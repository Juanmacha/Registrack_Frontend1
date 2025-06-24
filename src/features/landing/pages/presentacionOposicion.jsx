import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/landingNavbar';
import authData from '../../auth/services/authData'; // Importamos el servicio de autenticación
import { FaRegFileArchive } from "react-icons/fa";


const PresentacionOposicion = () => {
    const navigate = useNavigate();
    const user = authData.getUser(); // Usamos el mismo método que el navbar

    const handleAdquirirServicio = () => {
        if (!user) {
            alert("Debes estar logueado para adquirir un servicio");
            navigate("/login");
        } else {
            navigate("#"); // Cambia esta ruta por la correcta si es diferente
        }
    };

    return (
        <section>
            <LandingNavbar />

            <div className="p-6 md:p-10 max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-gray-500 to-yellow-400 bg-clip-text text-transparent pb-3">
                    Presentacion de Oposicion
                </h2>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-6 relative">
                    <p className="text-gray-700 text-left font-medium mb-2">
                        Si una nueva marca es similar o idéntica a la tuya, puedes presentar una oposición a su registro para proteger tu identidad comercial y evitar posibles conflictos legales. En Nombre de tu empresa, nos encargamos de todo el proceso de oposición, asegurando que tu marca se mantenga única y libre de riesgos por parte de terceros.
                    </p>


                    <p className="text-gray-700 mb-2 text-left">¿Por qué presentar una oposición?</p>
                    <span className='text-left'>Para evitar que otra empresa registre una marca que pueda confundirse con la tuya y afectar tu reputación comercial.</span>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-left">¿Cómo lo hacemos?</h3>
                        <ol className="list-decimal list-inside text-gray-700 space-y-1 text-left">
                            <li><span className="font-medium">Análisis de riesgo</span> – Evaluamos si la nueva marca podría generar confusión con la tuya.</li>
                            <li><span className="font-medium">Redacción del documento</span> – Elaboramos y fundamentamos la solicitud con argumentos legales sólidos.</li>
                            <li><span className="font-medium">Presentación y seguimiento</span> – Registramos el trámite ante la <span className="italic">Cámara de Industria y Comercio</span> y damos seguimiento hasta su resolución.</li>
                        </ol>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                        <button
                            onClick={handleAdquirirServicio}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Adquirir Servicio
                        </button>
                        <FaRegFileArchive className="text-5xl ml-5" />
                    </div>
                </div>
            </div>
            <div className="p-6 md:p-10 max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-gray-500 to-yellow-400 bg-clip-text text-transparent pb-3">
                    Respuesta de Oposición
                </h2>

                <div className="bg-gray-100 border border-gray-300 rounded-md p-6 relative">
                    <p className="text-gray-700 text-left font-medium mb-2">
                        Si tu marca ha recibido una oposición durante su registro, puedes responder para defender tu identidad comercial y continuar con el proceso legal. En <span className="font-semibold">Registrack</span>, preparamos y gestionamos tu respuesta para garantizar que tu marca tenga todas las oportunidades de ser registrada correctamente.
                    </p>

                    <p className="text-gray-700 text-left mb-2">
                        Evita perder tu marca. Nos encargamos de todo el proceso legal para que puedas avanzar con confianza.
                    </p>

                    <p className="text-gray-700 mb-4 text-left">
                        Si enfrentas una oposición, no te detengas. Con <span className="font-semibold">Certimarcas</span>, responde de forma profesional y oportuna.
                    </p>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-2 text-left">¿Cómo lo hacemos?</h3>
                        <ol className="list-decimal list-inside text-gray-700 space-y-1 text-left">
                            <li><span className="font-medium">Análisis de riesgo</span> – Evaluamos los motivos de la oposición y analizamos su impacto en tu marca.</li>
                            <li><span className="font-medium">Preparación del documento de respuesta</span> – Redactamos tu defensa con argumentos jurídicos sólidos.</li>
                            <li><span className="font-medium">Presentación y seguimiento</span> – Registramos la respuesta ante la <span className="italic">Cámara de Industria y Comercio</span> y realizamos el seguimiento correspondiente.</li>
                        </ol>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                        <button
                            onClick={handleAdquirirServicio}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Adquirir Servicio
                        </button>
                        <FaRegFileArchive className="text-5xl ml-5" />
                    </div>
                </div>
            </div>


        </section>
    );
};

export default PresentacionOposicion;
