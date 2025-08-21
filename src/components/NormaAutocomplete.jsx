import React, { useState, useEffect } from 'react';

const NormaAutocomplete = ({ value, onChange, onParametersChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showModal, setShowModal] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState(null);
  const [selectedNorma, setSelectedNorma] = useState(null);
  const [selectedSpecification, setSelectedSpecification] = useState(null);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [allSelections, setAllSelections] = useState([]);
  const [step, setStep] = useState(1);

  const normasDB = {
    "AGUA POTABLE": {
      "NOM-127-SSA1-2021": {
        "MUESTREO": {
          "NOM-230-SSA1-2002": ["AGUAS POTABLE - MUESTREO"]
        },
        "Tabla 1 - Especificaciones sanitarias físicas": {
          "STANDARD METHODS 2130 24TH ED. 2023": ["Turbiedad"],
          "STANDARD METHODS 4500-H+ 24TH ED. 2023": ["Ph"],
          "STANDARD METHODS 2120 24TH ED. 2023": ["Color verdadero"]
        },
        "Tabla 2 - Especificaciones sanitarias químicas": {
          "NMX-AA-058-SCFI-2001 / STANDARD METHODS 4500 CN-E 24TH ED. 2023": ["Cianuros totales"],
          "STANDARD METHODS 2340 24TH ED. 2023": ["Dureza total como CaCO3"],
          "STANDARD METHODS 4500 F 24TH ED. 2023": ["Fluoruros"],
          "STANDARD METHODS 4500-NH3 24TH ED. 2023": ["Nitrógeno amoniacal"],
          "NMX-AA-079-SCFI-2001 / STANDARD METHODS 4500-NO3- 24TH ED. 2023": ["Nitrógeno de nitratos"],
          "STANDARD METHODS 4500-NO2- 24TH ED. 2023": ["Nitrógeno de nitritos"],
          "STANDARD METHODS 2540 24TH ED. 2023": ["Sólidos disueltos totales"],
          "STANDARD METHODS 4500-SO4-2 24TH ED. 2023": ["Sulfatos"],
          "NMX-AA-039-SCFI-2001 / STANDARD METHODS 5540 24TH ED. 2023": ["Sustancias Activas al azul de metileno"]
        },
        "Tabla 4 - Especificaciones sanitarias de metales y metaloides": {
          "NMX-AA-131/1-SCFI-2021": ["Arsénico", "Bario", "Aluminio", "Cadmio", "Cobre", "Cromo total", "Hierro", "Manganeso", "Níquel", "Plomo", "Selenio", "MERCURIO"]
        },
        "Tabla 9 - Especificaciones sanitarias de residuales de la desinfección": {
          "STANDARD METHODS 4500-Cl 24TH ED. 2023 / NOM-201-SSA1-2015 A.3.10": ["Cloro residual libre"],
          "STANDARD METHODS 4500-I 24TH ED. 2023": ["Yodo residual libre"],
          "NMX-AA-131/1-SCFI-2021": ["Plata total"]
        },
        "Tabla 6 - Especificaciones sanitarias microbiológicas": {
          "-": ["E.coli o coliformes termotolerantes", "Giardia lamblia"]
        },
        "Tabla 7 - Especificaciones sanitarias de fitotoxinas": {
          "-": ["Microcistina-LR"]
        },
        "Tabla 8 - Especificaciones sanitarias de radiactividad": {
          "-": ["Radiactividad alfa", "Radiactividad beta"]
        },
        "Tabla 10 - Especificaciones sanitarias de subproductos de la desinfección - trihalometanos": {
          "EPA 8260D 2018": ["Bromodiclorometano", "Bromoformo", "Cloroformo", "Dibromoclorometano"]
        },
        "Tabla 11 - Especificaciones sanitarias de subproductos de la desinfección - ácidos haloacéticos": {
          "-": ["Ácido cloroacético", "Ácido dicloroacético", "Ácido tricloroacético"]
        },
        "Tabla 12 - Especificaciones sanitarias de subproductos de la desinfección - aniones": {
          "-": ["Bromatos", "Cloratos", "Cloritos"]
        },
        "Tabla 13 - Especificaciones sanitarias de subproductos de la desinfección - carbonilos": {
          "EPA 8315A": ["Formaldehído"]
        },
        "Tabla 14 - Especificaciones sanitarias de compuestos orgánicos sintéticos": {
          "-": ["COMPUESTOS ORGÁNICOS HALOGENADOS ADSORBIBLES FIJOS (AOX)", "COMPUESTOS ORGÁNICOS NO HALOGENADOS", "COMPUESTOS ORGÁNICOS HALOGENADOS ADSORBIBLES PURGABLES (POX)"],
          "EPA 8260D 2017": ["COMPUESTOS ORGÁNICOS VOLÁTILES NO HALOGENADOS (BENCENO)", "COMPUESTOS ORGÁNICOS VOLÁTILES NO HALOGENADOS (ESTIRENO)", "COMPUESTOS ORGÁNICOS VOLÁTILES NO HALOGENADOS (ETILBENCENO)", "COMPUESTOS ORGÁNICOS VOLÁTILES NO HALOGENADOS (TOLUENO)", "COMPUESTOS ORGÁNICOS VOLÁTILES NO HALOGENADOS (XILENOS)"]
        },
        "Tabla A.1 Límites permisibles de compuestos orgánicos halogenados adsorbibles fijos": {
          "-": ["APÉNDICE A (VARIOS PARÁMETROS)"]
        }
      }
    },
    "AGUA RESIDUAL": {
      "NOM-001-SEMARNAT-2021 / NOM 001-SEMARNAT-1996": {
        "MUESTREO": {
          "NMX-AA-003-1980": ["AGUAS RESIDUALES - MUESTREO"],
          "NMX-AA-014-1980": ["CUERPOS RECEPTORES - MUESTREO"]
        },
        "CONTAMINANTES BÁSICOS": {
          "NMX-AA-007-SCFI-2013": ["TEMPERATURA"],
          "NMX-AA-008-SCFI-2016": ["PH"],
          "NMX-AA-006-SCFI-2010": ["MATERIA FLOTANTE"],
          "NMX-AA-093-SCFI-2018": ["CONDUCTIVIDAD"],
          "NMX-AA-079-SCFI-2001": ["NITRATOS"],
          "NMX-AA-099-SCFI-2021": ["NITRITOS"],
          "NMX-AA-026-SCFI-2010": ["NITRÓGENO TOTAL KJELDAHL"],
          "NMX-AA-034-SCFI-2015": ["SÓLIDOS SUSPENDIDOS TOTALES"],
          "NMX-AA-004-SCFI-2013": ["SÓLIDOS SEDIMENTABLES"],
          "NMX-AA-029-SCFI-2001": ["FOSFORO TOTAL"],
          "NMX-AA-005-SCFI-2013": ["GRASAS Y ACEITES"],
          "NMX-AA-028-SCFI-2021": ["DEMANDA BIOQUIMICA DE OXÍGENO"],
          "NMX-AA-017-SCFI-2021": ["COLOR VERDADERO"],
          "NMX-AA-030/2-SCFI-2011": ["DEMANDA QUIMICA DE OXÍGENO"],
          "NMX-AA-073-SCFI-2001": ["CLORUROS"],
          "(NMX-AA-187-SCFI-2021)": ["CARBONO ORGÁNICO TOTAL"],
          "NMX-AA-113-SCFI-2012": ["HUEVOS DE HELMINTO"],
          "NMX-AA-042-SCFI-2015": ["E. COLI", "COLIFORMES FECALES"],
          "NMX-AA-120-SCFI-2016 / NMX-AA-167-SCFI-2017": ["ENTEROCOCOS FECALES"],
          "NMX-AA-112-SCFI-2017": ["TOXICIDAD AGUDA (VIBRIO FISHERI)"]
        },
        "METALES Y METALOIDES": {
          "NMX-AA-058-SCFI-2001": ["CIANURO"],
          "NMX-AA-131/1-SCFI-2021": ["ARSÉNICO", "CADMIO", "COBRE", "CROMO", "NIQUEL", "PLOMO", "ZINC", "MERCURIO"]
        }
      },
      "NOM-002-SEMARNAT-1996": {
        "MUESTREO": {
          "NMX-AA-003-1980": ["AGUAS RESIDUALES - MUESTREO"]
        },
        "CONTAMINANTES BÁSICOS": {
          "NMX-AA-007-SCFI-2013": ["TEMPERATURA"],
          "NMX-AA-008-SCFI-2016": ["PH"],
          "NMX-AA-006-SCFI-2010": ["MATERIA FLOTANTE"],
          "NMX-AA-093-SCFI-2018": ["CONDUCTIVIDAD"],
          "NMX-AA-034-SCFI-2015": ["SÓLIDOS SUSPENDIDOS TOTALES"],
          "NMX-AA-004-SCFI-2013": ["SÓLIDOS SEDIMENTABLES"],
          "NMX-AA-005-SCFI-2013": ["GRASAS Y ACEITES"],
          "NMX-AA-028-SCFI-2021": ["DEMANDA BIOQUIMICA DE OXÍGENO"],
          "NMX-AA-030/2-SCFI-2011": ["DEMANDA QUIMICA DE OXÍGENO"]
        },
        "METALES Y METALOIDES": {
          "NMX-AA-058-SCFI-2001": ["CIANURO"],
          "NMX-AA-131/1-SCFI-2021": ["ARSÉNICO", "CADMIO", "COBRE", "NIQUEL", "PLOMO", "ZINC", "MERCURIO"],
          "NMX-AA-044-SCFI-2014": ["CROMO HEXAVALENTE"]
        }
      },
      "NOM-003-SEMARNAT-1997": {
        "MUESTREO": {
          "NMX-AA-003-1980": ["AGUAS RESIDUALES - MUESTREO"],
          "NMX-AA-014-1980": ["CUERPOS RECEPTORES - MUESTREO"]
        },
        "CONTAMINANTES BÁSICOS": {
          "NMX-AA-007-SCFI-2013": ["TEMPERATURA"],
          "NMX-AA-008-SCFI-2016": ["PH"],
          "NMX-AA-006-SCFI-2010": ["MATERIA FLOTANTE"],
          "NMX-AA-093-SCFI-2018": ["CONDUCTIVIDAD"],
          "NMX-AA-034-SCFI-2015": ["SÓLIDOS SUSPENDIDOS TOTALES"],
          "NMX-AA-005-SCFI-2013": ["GRASAS Y ACEITES"],
          "NMX-AA-028-SCFI-2021": ["DEMANDA BIOQUIMICA DE OXÍGENO"],
          "NMX-AA-030/2-SCFI-2011": ["DEMANDA QUIMICA DE OXÍGENO"],
          "NMX-AA-113-SCFI-2012": ["HUEVOS DE HELMINTO"],
          "NMX-AA-042-SCFI-2015": ["COLIFORMES FECALES Y TOTALES"]
        },
        "METALES Y METALOIDES": {
          "NMX-AA-058-SCFI-2001": ["CIANURO"],
          "NMX-AA-131/1-SCFI-2021": ["ARSÉNICO", "CADMIO", "COBRE", "CROMO", "NIQUEL", "PLOMO", "ZINC", "MERCURIO"]
        }
      }
    },
    "AGUA CONGÉNITA": {
      "NOM-143-SEMARNAT-2003": {
        "MUESTREO": {
          "MÉTODO INTERNO": ["AGUAS CONGÉNITAS - MUESTREO"]
        },
        "CROMATOGRAFICOS": {
          "EPA 8015D 2003": ["GASOLINA RANGO ORGÁNICO (HFL)", "DIÉSEL RANGO ORGÁNICO (HFM)"]
        },
        "FISICOQUÍMICOS": {
          "EPA METHOD 1664B 2010": ["HIDROCARBUROS DE FRACCIÓN PESADA (HFP)"],
          "NOM-143-SEMARNAT-2003 ANEXO 2": ["SOLIDOS DISUELTOS TOTALES"]
        }
      }
    },
    "AMBIENTE LABORAL": {
      "NA": {
        "AMBIENTE LABORAL": {
          "NOM-025-STPS-2008": ["Condiciones de Iluminación"],
          "NOM-011-STPS-2001": ["Ruido laboral SONOMETRÍA", "Ruido laboral DOSIMETRÍA"],
          "NOM-022-STPS-2015": ["Tierras físicas (CONTINUIDAD)", "Tierras físicas (ESTUDIO)"],
          "NOM-015-STPS-2001": ["Condiciones térmicas (Elevadas)", "Condiciones térmicas (Abatidas)"]
        }
      }
    },
    "FUENTES FIJAS": {
      "NOM-081-SEMARNAT-1994": {
        "RUIDO PERIMETRAL": {
          "NOM-081-SEMARNAT-1994": ["Ruido perimetral DIURNO", "Ruido perimetral NOCTURNO", "Ruido perimetral MIXTO"]
        }
      },
      "NOM-038-SEMARNAT-1993": {
        "CALIDAD DEL AIRE": {
          "NOM-038-SEMARNAT-1993": ["Determinación de SO2"]
        }
      },
      "NOM-037-SEMARNAT-1993": {
        "CALIDAD DEL AIRE": {
          "NOM-037-SEMARNAT-1993": ["Determinación de NO, NO2 Y NOX"]
        }
      },
      "NOM-036-SEMARNAT-1993": {
        "CALIDAD DEL AIRE": {
          "NOM-036-SEMARNAT-1993": ["Determinación de O3"]
        }
      },
      "NOM-034-SEMARNAT-2011": {
        "CALIDAD DEL AIRE": {
          "NOM-034-SEMARNAT-2011": ["Determinación de CO"]
        }
      },
      "CFR 40 PARTE 50, APÉNDICE J": {
        "CALIDAD DEL AIRE": {
          "CFR 40 PARTE 50, APÉNDICE J / TEOM 1405 Ambient Particulate Monitor": ["Determinación de PM10"]
        }
      },
      "CFR 40 PARTE 50, APÉNDICE L": {
        "CALIDAD DEL AIRE": {
          "CFR 40 PARTE 50, APÉNDICE L / TEOM 1405-F Ambient Particulate Monitor": ["Determinación de PM2.5"]
        }
      },
      "NA": {
        "CONDICIONES AMBIENTALES": {
          "NA": ["CONDICIONES AMBIENTALES"]
        }
      }
    },
    "OTROS": {
      "-": {
        "ORGANOLEPTICOS": {
          "STANDARD METHODS 2150 24TH ED. 2023": ["OLOR"],
          "STANDARD METHODS 2160 24TH ED. 2023": ["SABOR"]
        },
        "FISICOQUÍMICOS": {
          "NMX-AA-050-SCFI-2001": ["FENOLES O COMPUESTOS FENOLICOS"]
        }
      }
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

  const resetSelection = () => {
    setSelectedMatrix(null);
    setSelectedNorma(null);
    setSelectedSpecification(null);
    setSelectedMethods([]);
    setSelectedParameters([]);
    setStep(1);
  };

  const handleMethodToggle = (method) => {
    setSelectedMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const getAvailableNormas = () => {
    if (!selectedMatrix) return [];
    return Object.keys(normasDB[selectedMatrix]);
  };

  const shouldShowNormaStep = () => {
    return selectedMatrix && getAvailableNormas().length > 1;
  };

  const getCurrentNorma = () => {
    if (selectedNorma) return selectedNorma;
    if (selectedMatrix) {
      const normas = getAvailableNormas();
      return normas.length === 1 ? normas[0] : null;
    }
    return null;
  };

  const resetModal = () => {
    resetSelection();
    setAllSelections([]);
  };

  const handleParameterToggle = (parameter) => {
    setSelectedParameters(prev => 
      prev.includes(parameter) 
        ? prev.filter(p => p !== parameter)
        : [...prev, parameter]
    );
  };

  const addSelection = () => {
    const currentNorma = getCurrentNorma();
    const newSelection = {
      matrix: selectedMatrix,
      norma: currentNorma,
      methods: selectedMethods,
      parameters: selectedParameters
    };
    setAllSelections(prev => [...prev, newSelection]);
    resetSelection();
  };

  const addAndFinalize = () => {
    const currentNorma = getCurrentNorma();
    const newSelection = {
      matrix: selectedMatrix,
      norma: currentNorma,
      methods: selectedMethods,
      parameters: selectedParameters
    };
    const updatedSelections = [...allSelections, newSelection];
    
    const allParts = [];
    const allParams = [];
    
    updatedSelections.forEach(selection => {
      const parts = [selection.matrix, selection.norma, selection.methods.join(', ')];
      allParts.push(parts.filter(Boolean).join(' - '));
      allParams.push(...selection.parameters);
    });
    
    const finalValue = allParts.join(' | ');
    setInputValue(finalValue);
    if (onChange) {
      onChange({ target: { name: 'norma', value: finalValue } });
    }
    if (onParametersChange) {
      onParametersChange(allParams.join(', '));
    }
    setShowModal(false);
    resetModal();
  };

  const getAvailableMethods = () => {
    if (!selectedMatrix || !selectedSpecification) return [];
    const currentNorma = getCurrentNorma();
    if (!currentNorma) return [];
    return Object.keys(normasDB[selectedMatrix][currentNorma][selectedSpecification]);
  };

  const getAllParametersFromNorma = () => {
    if (!selectedMatrix) return [];
    const currentNorma = getCurrentNorma();
    if (!currentNorma) return [];
    
    const allParams = new Set();
    Object.keys(normasDB[selectedMatrix][currentNorma]).forEach(spec => {
      Object.keys(normasDB[selectedMatrix][currentNorma][spec]).forEach(method => {
        normasDB[selectedMatrix][currentNorma][spec][method].forEach(param => {
          allParams.add(param);
        });
      });
    });
    return Array.from(allParams).sort();
  };

  const getAvailableSpecifications = () => {
    if (!selectedMatrix) return [];
    const currentNorma = getCurrentNorma();
    if (!currentNorma) return [];
    return Object.keys(normasDB[selectedMatrix][currentNorma]);
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
        onClick={() => { setShowModal(true); resetSelection(); }}
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
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                {step === 1 ? 'Seleccionar Matriz' : 
                 step === 2 && shouldShowNormaStep() ? 'Seleccionar Norma' :
                 step === 2 || (step === 3 && !shouldShowNormaStep()) ? 'Seleccionar Especificaciones' :
                 (step === 3 && !shouldShowNormaStep()) || (step === 4 && shouldShowNormaStep()) ? 'Seleccionar Métodos de Referencia' : 'Seleccionar Parámetros'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetModal(); }}
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

            {step === 1 && (
              <div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Matrices</h4>
                {Object.keys(normasDB).map((matrix, index) => (
                  <div
                    key={index}
                    onClick={() => { 
                      setSelectedMatrix(matrix);
                      const normas = Object.keys(normasDB[matrix]);
                      if (normas.length === 1) {
                        setSelectedNorma(normas[0]);
                        setStep(2);
                      } else {
                        setStep(2);
                      }
                    }}
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
                    {matrix}
                  </div>
                ))}
              </div>
            )}

            {step === 2 && selectedMatrix && shouldShowNormaStep() && (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Matrices
                  </span> › {selectedMatrix}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Normas</h4>
                {getAvailableNormas().map((norma, index) => (
                  <div
                    key={index}
                    onClick={() => { setSelectedNorma(norma); setStep(3); }}
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
                    {norma}
                  </div>
                ))}
              </div>
            )}

            {((step === 2 && selectedMatrix && !shouldShowNormaStep()) || (step === 3 && selectedMatrix && shouldShowNormaStep())) && (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Matrices
                  </span> › 
                  {shouldShowNormaStep() ? (
                    <>
                      <span onClick={() => setStep(2)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedMatrix}
                      </span> › {getCurrentNorma()}
                    </>
                  ) : (
                    selectedMatrix
                  )}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Especificaciones</h4>
                {getAvailableSpecifications().map((spec, index) => (
                  <div
                    key={index}
                    onClick={() => { 
                      setSelectedSpecification(spec); 
                      setStep(shouldShowNormaStep() ? 4 : 3);
                    }}
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
                    {spec}
                  </div>
                ))}
              </div>
            )}

            {((step === 3 && selectedMatrix && selectedSpecification && !shouldShowNormaStep()) || (step === 4 && selectedMatrix && selectedSpecification && shouldShowNormaStep())) && (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Matrices
                  </span> › 
                  {shouldShowNormaStep() ? (
                    <>
                      <span onClick={() => setStep(2)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedMatrix}
                      </span> › 
                      <span onClick={() => setStep(3)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {getCurrentNorma()}
                      </span> › {selectedSpecification}
                    </>
                  ) : (
                    <>
                      <span onClick={() => setStep(2)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedMatrix}
                      </span> › {selectedSpecification}
                    </>
                  )}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Métodos de Referencia (Selecciona múltiples)</h4>
                {getAvailableMethods().map((method, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      margin: '0.25rem 0',
                      backgroundColor: selectedMethods.includes(method) ? '#e3f2fd' : '#f9fafb',
                      borderRadius: '8px',
                      border: selectedMethods.includes(method) ? '2px solid #2b91e7' : '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleMethodToggle(method)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMethods.includes(method)}
                      onChange={() => handleMethodToggle(method)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                      {method}
                    </label>
                  </div>
                ))}
                <div style={{ marginTop: '2rem' }}>
                  <button
                    onClick={() => setStep(shouldShowNormaStep() ? 5 : 4)}
                    disabled={selectedMethods.length === 0}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: selectedMethods.length > 0 ? '#2b91e7' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selectedMethods.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem'
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {((step === 4 && selectedMatrix && selectedSpecification && selectedMethods.length > 0 && !shouldShowNormaStep()) || (step === 5 && selectedMatrix && selectedSpecification && selectedMethods.length > 0 && shouldShowNormaStep())) && (
              <div>
                <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                  <span onClick={() => setStep(1)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                    Matrices
                  </span> › 
                  {shouldShowNormaStep() ? (
                    <>
                      <span onClick={() => setStep(2)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedMatrix}
                      </span> › 
                      <span onClick={() => setStep(3)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {getCurrentNorma()}
                      </span> › 
                      <span onClick={() => setStep(4)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedSpecification}
                      </span> › Métodos ({selectedMethods.length})
                    </>
                  ) : (
                    <>
                      <span onClick={() => setStep(2)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedMatrix}
                      </span> › 
                      <span onClick={() => setStep(3)} style={{ cursor: 'pointer', color: '#2b91e7' }}>
                        {selectedSpecification}
                      </span> › Métodos ({selectedMethods.length})
                    </>
                  )}
                </div>
                <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Parámetros de {getCurrentNorma()}</h4>
                {getAllParametersFromNorma().map((parameter, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '0.75rem',
                      margin: '0.25rem 0',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedParameters.includes(parameter)}
                      onChange={() => handleParameterToggle(parameter)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                      {parameter}
                    </label>
                  </div>
                ))}
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={addSelection}
                    disabled={selectedParameters.length === 0}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: selectedParameters.length > 0 ? '#2b91e7' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selectedParameters.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem'
                    }}
                  >
                    Agregar y Seleccionar Otra
                  </button>
                  <button
                    onClick={addAndFinalize}
                    disabled={selectedParameters.length === 0}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: selectedParameters.length > 0 ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selectedParameters.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem'
                    }}
                  >
                    Finalizar
                  </button>
                </div>
                {allSelections.length > 0 && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Selecciones agregadas:</h5>
                    {allSelections.map((sel, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        {idx + 1}. {sel.matrix} - {sel.norma} - {sel.methods.join(', ')} ({sel.parameters.length} parámetros)
                      </div>
                    ))}
                  </div>
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