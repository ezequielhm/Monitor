const getSizeBasedOnWidth = (width: number | undefined, columna: string, tabla: string): number => { //se le pasa el tamaño de la pantalla, nombre del campo y nombre de la tabla a la que pertenece

    if (!width) return 100; // Valor por defecto si no se puede obtener el ancho de la pantalla
    // console.log()
    const tableWidthCuentasCero = (width * 47) / 100;  // ~47% para cada tabla de "cuentas cero"
    width = (width) - 145; //134
    const tableWidthPequena = (width * 31) / 80;
    const tableWidthGrande = (width * 49) / 80;
    const tableWidthCompleta = width;


    // Asignación de medidas de las tablas

    //Pantalla Conciliar
    const apuntesConciliar = {
        fecha: 12,
        id: 18,
        descripcion: 36,
        importe: 18,
        claveImporte: 11,
        check: 5,
    }
    const bancosConciliar = {
        check: 3,
        fecha: 8,
        info_1: 16,
        info_2: 16,
        info_3_4: 16,
        info_5: 17,
        importe: 12,
        claveImporte: 11,
    }

    //Pantalla Hoja de Trabajo
    const apuntesWorksheet = {
        fechaApunte: 11,
        id: 11,
        desc: 20,
        importe: 15,
        claveImporte: 8,
        estado: 15,
        comentario: 20,
    }
    const bancosWorksheet = {
        fechaOperacion: 8,
        info_1: 13,
        info_2: 13,
        info_3_4: 13,
        info_5: 13,
        importe: 12,
        claveImporte: 6,
        estado: 9,
        comentario: 13,
    }

    // Pantalla Revisión
    const apuntesRevision = {
        fechaApunte: 14,
        id: 11,
        desc: 20,
        importe: 19,
        claveImporte: 12,
        estado: 15,
        comentario: 20,
    }
    const bancosRevision = {
        fechaMovimiento: 10,
        info_1: 13,
        info_2: 13,
        info_3_4: 13,
        info_5: 10,
        importe: 10,
        claveImporte: 6,
        estado: 11,
        comentario: 13,
    }

    const apuntesConciliadosRevision = {
        fechaApunte: 15,
        id: 18,
        descripcion: 26,
        importe: 18,
        claveImporte: 11,
        opciones: 15
    }
    const apuntesTodosRevision = {
        fechaApunte: 15,
        id: 18,
        descripcion: 26,
        importe: 18,
        claveImporte: 11,
        opciones: 15
    }
    const bancosConciliadosRevision = {
        fechaMovimiento: 8,
        id: 10,
        info_1: 15,
        info_2: 10,
        info_3_4: 15,
        info_5: 10,
        importe: 16,
        claveImporte: 6,
        opciones: 10
    }
    const bancosTodosRevision = {
        fechaMovimiento: 8,
        id: 10,
        info_1: 15,
        info_2: 10,
        info_3_4: 15,
        info_5: 10,
        importe: 16,
        claveImporte: 6,
        opciones: 10
    }

    const apuntesEditar = {
        fechaApunte: 16,
        id: 20,
        descripcion: 20,
        importe: 26,
        claveImporte: 12,
        check: 6
    }

    const bancosEditar = {
        check: 6,
        fechaMovimiento: 16,
        info_1: 14,
        info_2: 14,
        info_3_4: 14,
        info_5: 14,
        importe: 16,
        claveImporte: 6,
    }

    const apuntesConciliacionHistorica = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 11,
        fechaEfectiva: 12,
    }

    const movimientosConciliacionHistorica = {
        fecha: 8,
        info_1: 16,
        info_2: 16,
        info_3_4: 16,
        info_5: 16,
        importe: 12,
        claveImporte: 8,
        fechaEfectiva: 8,
    }
    const gestionCuentas = {
        empresa1: 8,
        cuenta1: 18,
        empresa2: 8,
        cuenta2: 18,
        usuario: 12,
        activo: 6,
        fechaInicio: 10,
        tercero1: 10,
        tercero2: 10
    };
    const apuntesCuentasCeroIzquierda = {
        check: 5,
        fecha: 12,
        id: 18,
        descripcion: 35,
        importe: 18,
        claveImporte: 5,
    };
    const apuntesCuentasCeroDerecha = {
        check: 5,
        fecha: 12,
        id: 18,
        descripcion: 35,
        importe: 18,
        claveImporte: 5,
    };

    const editarIzquierda = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5,
        check: 10,
    }

    const worksheetCuentasCeroDerecha = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5
    }

    const worksheetCuentasCeroIzquierda = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5
    }

    const revisionCuentasCeroDerecha = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5
    }

    const revisionTodosCuentasCeroDerecha = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5,
        opciones: 5
    }

    const revisionTodosCuentasCeroIzquierda = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5,
        opciones: 5
    }

    const revisionConciliadosCuentasCeroDerecha = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5,
        opciones: 5
    }

    const revisionConciliadosCuentasCeroIzquierda = {
        fecha: 12,
        id: 14,
        descripcion: 33,
        importe: 18,
        claveImporte: 5,
        opciones: 5
    }

    if (tabla === 'apuntesConciliar') {
        switch (columna) {
            case 'check':
                return (apuntesConciliar.check / 100) * tableWidthPequena;
            case 'fecha':
                return (apuntesConciliar.fecha / 100) * tableWidthPequena;
            case 'id':
                return (apuntesConciliar.id / 100) * tableWidthPequena;
            case 'descripcion':
                return (apuntesConciliar.descripcion / 100) * tableWidthPequena;
            case 'importe':
                return (apuntesConciliar.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesConciliar.claveImporte / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }
    } else if (tabla === 'bancosConciliar') {
        switch (columna) {
            case 'check':
                return (bancosConciliar.check / 100) * tableWidthGrande;
            case 'fecha':
                return (bancosConciliar.fecha / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosConciliar.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosConciliar.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosConciliar.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosConciliar.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosConciliar.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosConciliar.claveImporte / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }
    } else if (tabla === 'apuntesWorksheet') {
        switch (columna) {
            case 'importe':
                return (apuntesWorksheet.importe / 100) * tableWidthPequena;
            case 'desc':
                return (apuntesWorksheet.desc / 100) * tableWidthPequena;
            case 'id':
                return (apuntesWorksheet.id / 100) * tableWidthPequena;
            case 'fechaApunte':
                return (apuntesWorksheet.fechaApunte / 100) * tableWidthPequena;
            case 'estado':
                return (apuntesWorksheet.estado / 100) * tableWidthPequena;
            case 'comentario':
                return (apuntesWorksheet.comentario / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesWorksheet.claveImporte / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }
    } else if (tabla === 'bancosWorksheet') {
        switch (columna) {
            case 'fechaOperacion':
                return (bancosWorksheet.fechaOperacion / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosWorksheet.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosWorksheet.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosWorksheet.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosWorksheet.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosWorksheet.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosWorksheet.claveImporte / 100) * tableWidthGrande;
            case 'estado':
                return (bancosWorksheet.estado / 100) * tableWidthGrande;
            case 'comentario':
                return (bancosWorksheet.comentario / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }

    } else if (tabla === 'apuntesRevision') {
        switch (columna) {
            case 'fechaApunte':
                return (apuntesRevision.fechaApunte / 100) * tableWidthPequena;
            case 'id':
                return (apuntesRevision.id / 100) * tableWidthPequena;
            case 'desc':
                return (apuntesRevision.desc / 100) * tableWidthPequena;
            case 'importe':
                return (apuntesRevision.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesRevision.claveImporte / 100) * tableWidthPequena;
            case 'estado':
                return (apuntesRevision.estado / 100) * tableWidthPequena;
            case 'comentario':
                return (apuntesRevision.comentario / 100) * tableWidthPequena;
            default:
                // console.log('NO SE CUMPLE');
                return 0.1 * tableWidthPequena;
        }

    } else if (tabla === 'bancosRevision') {
        switch (columna) {
            case 'fechaMovimiento':
                return (bancosRevision.fechaMovimiento / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosRevision.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosRevision.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosRevision.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosRevision.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosRevision.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosRevision.claveImporte / 100) * tableWidthGrande;
            case 'estado':
                return (bancosRevision.estado / 100) * tableWidthGrande;
            case 'comentario':
                return (bancosRevision.comentario / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }

    } else if (tabla === 'apuntesConciliadosRevision') {
        switch (columna) {
            case 'fechaApunte':
                return (apuntesConciliadosRevision.fechaApunte / 100) * tableWidthPequena;
            case 'id':
                return (apuntesConciliadosRevision.id / 100) * tableWidthPequena;
            case 'descripcion':
                return (apuntesConciliadosRevision.id / 100) * tableWidthPequena;
            case 'importe':
                return (apuntesConciliadosRevision.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesConciliadosRevision.claveImporte / 100) * tableWidthPequena;
            case 'opciones':
                return (apuntesConciliadosRevision.opciones / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }apuntesTodosRevision

    }else if (tabla === 'apuntesTodosRevision') {
        switch (columna) {
            case 'fechaApunte':
                return (apuntesTodosRevision.fechaApunte / 100) * tableWidthPequena;
            case 'id':
                return (apuntesTodosRevision.id / 100) * tableWidthPequena;
            case 'descripcion':
                return (apuntesTodosRevision.id / 100) * tableWidthPequena;
            case 'importe':
                return (apuntesTodosRevision.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesTodosRevision.claveImporte / 100) * tableWidthPequena;
            case 'opciones':
                return (apuntesTodosRevision.opciones / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }

    } else if (tabla === 'bancosConciliadosRevision') {
        switch (columna) {
            case 'fechaMovimiento':
                return (bancosConciliadosRevision.fechaMovimiento / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosConciliadosRevision.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosConciliadosRevision.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosConciliadosRevision.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosConciliadosRevision.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosConciliadosRevision.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosConciliadosRevision.claveImporte / 100) * tableWidthGrande;
            case 'opciones':
                return (bancosConciliadosRevision.opciones / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }

    } else if (tabla === 'bancosTodosRevision') {
        switch (columna) {
            case 'fechaMovimiento':
                return (bancosTodosRevision.fechaMovimiento / 100) * tableWidthGrande;
            case 'id':
                return (bancosTodosRevision.id / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosTodosRevision.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosTodosRevision.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosTodosRevision.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosTodosRevision.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosTodosRevision.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosTodosRevision.claveImporte / 100) * tableWidthGrande;
            case 'opciones':
                return (bancosTodosRevision.opciones / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }
    } 
    else if (tabla === 'apuntesEditar') {
        switch (columna) {
            case 'fechaApunte':
                return (apuntesEditar.fechaApunte / 100) * tableWidthPequena;
            case 'id':
                return (apuntesEditar.id / 100) * tableWidthPequena;
            case 'descripcion':
                return (apuntesEditar.descripcion / 100) * tableWidthPequena;

            case 'importe':
                return (apuntesEditar.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesEditar.claveImporte / 100) * tableWidthPequena;
            case 'check':
                return (apuntesEditar.check / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }

    } else if (tabla === 'bancosEditar') {
        switch (columna) {
            case 'check':
                return (bancosEditar.check / 100) * tableWidthGrande;
            case 'fechaMovimiento':
                return (bancosEditar.fechaMovimiento / 100) * tableWidthGrande;
            case 'info_1':
                return (bancosEditar.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (bancosEditar.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (bancosEditar.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (bancosEditar.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (bancosEditar.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (bancosEditar.claveImporte / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }

    } else if (tabla === 'apuntesConciliacionHistorica') {
        switch (columna) {
            case 'fecha':
                return (apuntesConciliacionHistorica.fecha / 100) * tableWidthPequena;
            case 'id':
                return (apuntesConciliacionHistorica.id / 100) * tableWidthPequena;
            case 'descripcion':
                return (apuntesConciliacionHistorica.descripcion / 100) * tableWidthPequena;
            case 'importe':
                return (apuntesConciliacionHistorica.importe / 100) * tableWidthPequena;
            case 'claveImporte':
                return (apuntesConciliacionHistorica.claveImporte / 100) * tableWidthPequena;
            case 'fechaEfectiva':
                return (apuntesConciliacionHistorica.fechaEfectiva / 100) * tableWidthPequena;
            default:
                return 0.1 * tableWidthPequena;
        }
    } else if (tabla === 'bancosConciliacionHistorica') {
        switch (columna) {
            case 'fecha':
                return (movimientosConciliacionHistorica.fecha / 100) * tableWidthGrande;
            case 'info_1':
                return (movimientosConciliacionHistorica.info_1 / 100) * tableWidthGrande;
            case 'info_2':
                return (movimientosConciliacionHistorica.info_2 / 100) * tableWidthGrande;
            case 'info_3_4':
                return (movimientosConciliacionHistorica.info_3_4 / 100) * tableWidthGrande;
            case 'info_5':
                return (movimientosConciliacionHistorica.info_5 / 100) * tableWidthGrande;
            case 'importe':
                return (movimientosConciliacionHistorica.importe / 100) * tableWidthGrande;
            case 'claveImporte':
                return (movimientosConciliacionHistorica.claveImporte / 100) * tableWidthGrande;
            case 'fechaEfectiva':
                return (movimientosConciliacionHistorica.fechaEfectiva / 100) * tableWidthGrande;
            default:
                return 0.1 * tableWidthGrande;
        }
    } else if (tabla === 'gestionCuentas') {
        switch (columna) {
            case 'empresa1':
                return (gestionCuentas.empresa1 / 100) * tableWidthCompleta;
            case 'cuenta1':
                return (gestionCuentas.cuenta1 / 100) * tableWidthCompleta;
            case 'empresa2':
                return (gestionCuentas.empresa2 / 100) * tableWidthCompleta;
            case 'cuenta2':
                return (gestionCuentas.cuenta2 / 100) * tableWidthCompleta;
            case 'usuario':
                return (gestionCuentas.usuario / 100) * tableWidthCompleta;
            case 'activo':
                return (gestionCuentas.activo / 100) * tableWidthCompleta;
            case 'fechaInicio':
                return (gestionCuentas.fechaInicio / 100) * tableWidthCompleta;
            case 'tercero1':
                return (gestionCuentas.tercero1 / 100) * tableWidthCompleta;
            case 'tercero2':
                return (gestionCuentas.tercero2 / 100) * tableWidthCompleta;
            default:
                return 0.1 * tableWidthCompleta;
        }
    } else if (tabla === 'apuntesCuentasCeroIzquierda') {
        switch (columna) {
            case 'check':
                return (apuntesCuentasCeroIzquierda.check / 100) * tableWidthCuentasCero;
            case 'fecha':
                return (apuntesCuentasCeroIzquierda.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (apuntesCuentasCeroIzquierda.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (apuntesCuentasCeroIzquierda.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (apuntesCuentasCeroIzquierda.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (apuntesCuentasCeroIzquierda.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'apuntesCuentasCeroDerecha') {
        switch (columna) {
            case 'check':
                return (apuntesCuentasCeroDerecha.check / 100) * tableWidthCuentasCero;
            case 'fecha':
                return (apuntesCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (apuntesCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (apuntesCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (apuntesCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (apuntesCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'editarIzquierda') {
        switch (columna) {
            case 'check':
                return (editarIzquierda.check / 100) * tableWidthCuentasCero;
            case 'fecha':
                return (editarIzquierda.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (editarIzquierda.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (editarIzquierda.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (editarIzquierda.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (editarIzquierda.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'worksheetCuentasCeroIzquierda') {
        switch (columna) {
            case 'fecha':
                return (worksheetCuentasCeroIzquierda.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (worksheetCuentasCeroIzquierda.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (worksheetCuentasCeroIzquierda.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (worksheetCuentasCeroIzquierda.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (worksheetCuentasCeroIzquierda.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    }
    else if (tabla === 'worksheetCuentasCeroDerecha') {
        switch (columna) {
            case 'fecha':
                return (worksheetCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (worksheetCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (worksheetCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (worksheetCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (worksheetCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    }
    else if (tabla === 'revisionCuentasCeroIzquierda') {
        switch (columna) {
            case 'fecha':
                return (worksheetCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (worksheetCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (worksheetCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (worksheetCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (worksheetCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'revisionCuentasCeroDerecha') {
        switch (columna) {
            case 'fecha':
                return (revisionCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (revisionCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (revisionCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (revisionCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (revisionCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'revisionTodosCuentasCeroDerecha') {
        switch (columna) {
            case 'fecha':
                return (revisionTodosCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (revisionTodosCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (revisionTodosCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (revisionTodosCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (revisionTodosCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            case 'Opciones':
                return (revisionTodosCuentasCeroDerecha.opciones / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'revisionTodosCuentasCeroIzquierda') {
        switch (columna) {
            case 'fecha':
                return (revisionTodosCuentasCeroIzquierda.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (revisionTodosCuentasCeroIzquierda.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (revisionTodosCuentasCeroIzquierda.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (revisionTodosCuentasCeroIzquierda.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (revisionTodosCuentasCeroIzquierda.claveImporte / 100) * tableWidthCuentasCero;
            case 'Opciones':
                return (revisionTodosCuentasCeroIzquierda.opciones / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'revisionConciliadosCuentasCeroDerecha') {
        switch (columna) {
            case 'fecha':
                return (revisionConciliadosCuentasCeroDerecha.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (revisionConciliadosCuentasCeroDerecha.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (revisionConciliadosCuentasCeroDerecha.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (revisionConciliadosCuentasCeroDerecha.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (revisionConciliadosCuentasCeroDerecha.claveImporte / 100) * tableWidthCuentasCero;
            case 'Opciones':
                return (revisionConciliadosCuentasCeroDerecha.opciones / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else if (tabla === 'revisionConciliadosCuentasCeroIzquierda') {
        switch (columna) {
            case 'fecha':
                return (revisionConciliadosCuentasCeroIzquierda.fecha / 100) * tableWidthCuentasCero;
            case 'id':
                return (revisionConciliadosCuentasCeroIzquierda.id / 100) * tableWidthCuentasCero;
            case 'descripcion':
                return (revisionConciliadosCuentasCeroIzquierda.descripcion / 100) * tableWidthCuentasCero;
            case 'importe':
                return (revisionConciliadosCuentasCeroIzquierda.importe / 100) * tableWidthCuentasCero;
            case 'claveImporte':
                return (revisionConciliadosCuentasCeroIzquierda.claveImporte / 100) * tableWidthCuentasCero;
            case 'Opciones':
                return (revisionConciliadosCuentasCeroIzquierda.opciones / 100) * tableWidthCuentasCero;
            default:
                return 0.1 * tableWidthCuentasCero;
        }
    } else {
    return 0.1 * tableWidthCompleta;
    }
}
export default getSizeBasedOnWidth;