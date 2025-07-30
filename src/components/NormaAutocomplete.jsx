import React, { useState, useEffect } from 'react';

const NormaAutocomplete = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const normasDB = {
    "AGUAS POTABLE - MUESTREO": {
      "NOM-230-SSA1-2002": {
        "Tabla 1 - Especificaciones sanitarias físicas": [
          "Turbiedad - STANDARD METHODS 2130 24TH ED. 2023",
          "Ph - STANDARD METHODS 4500-H⁺ 24TH ED. 2023",
          "Color verdadero - STANDARD METHODS 2120 24TH ED. 2023"
        ],
        "Tabla 2 - Especificaciones sanitarias químicas": [
          "Cianuros totales - STANDARD METHODS 4500 CN¯E 24TH ED. 2023",
          "Dureza total como CaCO3 - STANDARD METHODS 2340 24TH ED. 2023",
          "Fluoruros - STANDARD METHODS 4500 F 24TH ED. 2023",
          "Nitrógeno amoniacal - STANDARD METHODS 4500-NH3 24TH ED. 2023",
          "Nitrógeno de nitratos - NMX-AA-079-SCFI-2001 / STANDARD METHODS 4500-NO3¯ 24TH ED. 2023",
          "Nitrógeno de nitritos - STANDARD METHODS 4500-NO2¯ 24TH ED. 2023",
          "Sólidos disueltos totales - STANDARD METHODS 2540 24TH ED. 2023",
          "Sulfatos - STANDARD METHODS 4500-SO4¯² 24TH ED. 2023",
          "Sustancias Activas al azul de metileno - STANDARD METHODS 5540 24TH ED. 2023"
        ],
        "Tabla 4 - Especificaciones sanitarias de metales y metaloides": [
          "Arsénico - NMX-AA-131/1-SCFI-2021",
          "Bario",
          "Aluminio",
          "Cadmio",
          "Cobre",
          "Cromo total",
          "Hierro",
          "Manganeso",
          "Níquel",
          "Plomo",
          "Selenio",
          "MERCURIO"
        ],
        "Tabla 9 - Especificaciones sanitarias de residuales de la desinfección": [
          "Cloro residual libre - STANDARD METHODS 4500-Cl 24TH ED. 2023 / NOM-201-SSA1-2015 A.3.10",
          "Yodo residual libre - STANDARD METHODS 4500-I 24TH ED. 2023",
          "Plata total - NMX-AA-131/1-SCFI-2021"
        ]
      }
    },
    "AGUA RESIDUAL NOM-001-SEMARNAT-2021 Y NOM-001-SEMARNAT-1996": {
      "MUESTREO": [
        "AGUAS RESIDUALES - MUESTREO - NMX-AA-003-1980",
        "CUERPOS RECEPTORES - MUESTREO - NMX-AA-014-1980"
      ],
      "CONTAMINANTES BÁSICOS": [
        "TEMPERATURA - NMX-AA-007-SCFI-2013",
        "PH - NMX-AA-008-SCFI-2016",
        "MATERIA FLOTANTE - NMX-AA-006-SCFI-2010",
        "CONDUCTIVIDAD - NMX-AA-093-SCFI-2018",
        "NITRATOS - NMX-AA-079-SCFI-2001",
        "NITRITOS - NMX-AA-099-SCFI-2021",
        "NITRÓGENO TOTAL KJELDAHL - NMX-AA-026-SCFI-2010",
        "SÓLIDOS SUSPENDIDOS TOTALES - NMX-AA-034-SCFI-2015",
        "SÓLIDOS SEDIMENTABLES - NMX-AA-004-SCFI-2013",
        "FOSFORO TOTAL - NMX-AA-029-SCFI-2001",
        "GRASAS Y ACEITES - NMX-AA-005-SCFI-2013",
        "DEMANDA BIOQUIMICA DE OXÍGENO - NMX-AA-028-SCFI-2021",
        "COLOR VERDADERO - NMX-AA-017-SCFI-2021",
        "DEMANDA QUIMICA DE OXÍGENO - NMX-AA-030/2-SCFI-2011",
        "CLORUROS - NMX-AA-073-SCFI-2001",
        "CARBONO ORGÁNICO TOTAL - (NMX-AA-187-SCFI-2021)",
        "HUEVOS DE HELMINTO - NMX-AA-113-SCFI-2012",
        "E. COLI - NMX-AA-042-SCFI-2015",
        "COLIFORMES FECALES - NMX-AA-042-SCFI-2015",
        "ENTEROCOCOS FECALES - NMX-AA-120-SCFI-2016 / NMX-AA-167-SCFI-2017",
        "TOXICIDAD AGUDA (VIBRIO FISHERI) - NMX-AA-112-SCFI-2017"
      ],
      "METALES Y METALOIDES": [
        "CIANURO - NMX-AA-058-SCFI-2001",
        "ARSÉNICO - NMX-AA-131/1-SCFI-2021",
        "CADMIO - NMX-AA-131/1-SCFI-2021",
        "COBRE - NMX-AA-131/1-SCFI-2021",
        "CROMO - NMX-AA-131/1-SCFI-2021",
        "NIQUEL - NMX-AA-131/1-SCFI-2021",
        "PLOMO - NMX-AA-131/1-SCFI-2021",
        "ZINC - NMX-AA-131/1-SCFI-2021",
        "MERCURIO - NMX-AA-131/1-SCFI-2021"
      ]
    },
    "AGUA RESIDUAL NOM-002-SEMARNAT-1996": {
      "MUESTREO": [
        "AGUAS RESIDUALES - MUESTREO - NMX-AA-003-1980"
      ],
      "CONTAMINANTES BÁSICOS": [
        "TEMPERATURA - NMX-AA-007-SCFI-2013",
        "PH - NMX-AA-008-SCFI-2016",
        "MATERIA FLOTANTE - NMX-AA-006-SCFI-2010",
        "CONDUCTIVIDAD - NMX-AA-093-SCFI-2018",
        "SÓLIDOS SUSPENDIDOS TOTALES - NMX-AA-034-SCFI-2015",
        "SÓLIDOS SEDIMENTABLES - NMX-AA-004-SCFI-2013",
        "GRASAS Y ACEITES - NMX-AA-005-SCFI-2013",
        "DEMANDA BIOQUIMICA DE OXÍGENO - NMX-AA-028-SCFI-2021",
        "DEMANDA QUIMICA DE OXÍGENO - NMX-AA-030/2-SCFI-2011"
      ],
      "METALES Y METALOIDES": [
        "CIANURO - NMX-AA-058-SCFI-2001",
        "ARSÉNICO - NMX-AA-131/1-SCFI-2021",
        "CADMIO - NMX-AA-131/1-SCFI-2021",
        "COBRE - NMX-AA-131/1-SCFI-2021",
        "NIQUEL - NMX-AA-131/1-SCFI-2021",
        "PLOMO - NMX-AA-131/1-SCFI-2021",
        "ZINC - NMX-AA-131/1-SCFI-2021",
        "MERCURIO - NMX-AA-131/1-SCFI-2021",
        "CROMO HEXAVALENTE - NMX-AA-044-SCFI-2014"
      ]
    },
    "AGUA RESIDUAL NOM-003-SEMARNAT-1996": {
      "MUESTREO": [
        "AGUAS RESIDUALES - MUESTREO - NMX-AA-003-1980",
        "CUERPOS RECEPTORES - MUESTREO - NMX-AA-014-1980"
      ],
      "CONTAMINANTES BÁSICOS": [
        "TEMPERATURA - NMX-AA-007-SCFI-2013",
        "PH - NMX-AA-008-SCFI-2016",
        "MATERIA FLOTANTE - NMX-AA-006-SCFI-2010",
        "CONDUCTIVIDAD - NMX-AA-093-SCFI-2018",
        "SÓLIDOS SUSPENDIDOS TOTALES - NMX-AA-034-SCFI-2015",
        "GRASAS Y ACEITES - NMX-AA-005-SCFI-2013",
        "DEMANDA BIOQUIMICA DE OXÍGENO - NMX-AA-028-SCFI-2021",
        "DEMANDA QUIMICA DE OXÍGENO - NMX-AA-030/2-SCFI-2011",
        "HUEVOS DE HELMINTO - NMX-AA-113-SCFI-2012",
        "COLIFORMES FECALES Y TOTALES - NMX-AA-042-SCFI-2015"
      ],
      "METALES Y METALOIDES": [
        "CIANURO - NMX-AA-058-SCFI-2001",
        "ARSÉNICO - NMX-AA-131/1-SCFI-2021",
        "CADMIO - NMX-AA-131/1-SCFI-2021",
        "COBRE - NMX-AA-131/1-SCFI-2021",
        "CROMO - NMX-AA-131/1-SCFI-2021",
        "NIQUEL - NMX-AA-131/1-SCFI-2021",
        "PLOMO - NMX-AA-131/1-SCFI-2021",
        "ZINC - NMX-AA-131/1-SCFI-2021",
        "MERCURIO - NMX-AA-131/1-SCFI-2021"
      ]
    },
    "AGUA CONGÉNITA": {
      "MUESTREO": [
        "AGUAS CONGÉNITAS - MUESTREO - MÉTODO INTERNO"
      ],
      "CROMATOGRAFICOS": [
        "GASOLINA RANGO ORGÁNICO (HFL) - EPA 8015D 2003",
        "DIÉSEL RANGO ORGÁNICO (HFM) - EPA 8015D 2003"
      ],
      "FISICOQUÍMICOS": [
        "HIDROCARBUROS DE FRACCIÓN PESADA (HFP) - EPA METHOD 1664B 2010",
        "SOLIDOS DISUELTOS TOTALES - NOM-143-SEMARNAT-2003 ANEXO 2"
      ]
    },
    "AMBIENTE LABORAL": {
      "AMBIENTE LABORAL": [
        "Iluminación - NOM-025-STPS-2008",
        "Ruido laboral SONOMETRÍA - NOM-011-STPS-2001",
        "Ruido laboral DOSIMETRÍA - NOM-011-STPS-2001",
        "Tierras físicas (CONTINUIDAD) - NOM-022-STPS-2015",
        "Tierras físicas (ESTUDIO) - NOM-022-STPS-2015",
        "Condiciones térmicas (Elevadas) - NOM-015-STPS-2001",
        "Condiciones térmicas (Abatidas) - NOM-015-STPS-2001"
      ]
    }
  };

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange({ target: { name: 'norma', value: newValue } });
    }
  };

  const selectNorma = (norma) => {
    setInputValue(norma);
    if (onChange) {
      onChange({ target: { name: 'norma', value: norma } });
    }
    setShowModal(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Escriba o seleccione una norma..."
        style={{
          flex: 1,
          padding: '1rem 1.25rem',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'white',
          color: '#1f2937'
        }}
        name="norma"
      />
      <button
        type="button"
        onClick={() => setShowModal(true)}
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#2b91e7',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        Explorar
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Seleccionar Norma</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.5rem'
                }}
              >
                ×
              </button>
            </div>

            {!selectedCategory ? (
              <div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Categorías</h4>
                {Object.keys(normasDB).map((category, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '1rem',
                      margin: '0.5rem 0',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  >
                    {category}
                  </div>
                ))}
              </div>
            ) : !selectedSubcategory ? (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setSelectedCategory(null)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Categorías
                  </span> › {selectedCategory}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Subcategorías</h4>
                {Object.keys(normasDB[selectedCategory]).map((subcategory, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSubcategory(subcategory)}
                    style={{
                      padding: '1rem',
                      margin: '0.5rem 0',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  >
                    {subcategory}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setSelectedCategory(null)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Categorías
                  </span> › 
                  <span onClick={() => setSelectedSubcategory(null)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    {selectedCategory}
                  </span> › {selectedSubcategory}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Normas</h4>
                {Array.isArray(normasDB[selectedCategory][selectedSubcategory]) ? (
                  normasDB[selectedCategory][selectedSubcategory].map((norma, index) => (
                    <div
                      key={index}
                      onClick={() => selectNorma(norma)}
                      style={{
                        padding: '0.75rem',
                        margin: '0.25rem 0',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    >
                      {norma}
                    </div>
                  ))
                ) : (
                  Object.entries(normasDB[selectedCategory][selectedSubcategory]).map(([tabla, normas], index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: '600', margin: '1rem 0 0.5rem 0', color: '#374151', fontSize: '1rem' }}>
                        {tabla}
                      </div>
                      {normas.map((norma, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectNorma(norma)}
                          style={{
                            padding: '0.75rem',
                            margin: '0.25rem 0',
                            marginLeft: '1rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderLeft: '3px solid #2b91e7',
                            fontSize: '0.85rem'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        >
                          {norma}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NormaAutocomplete;