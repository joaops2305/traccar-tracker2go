function bloaqueio(unid) {
    // swal({ icon: "/public/spinner.gif", button: false });

    let temp = {};
    temp.deviceId = unid;

    swal({
        title: "Enviar Comando",
        text: "O que deseja fazer?",
        buttons: {
            desbloquear: {
                text: "Desbloquear",
                value: "desbloquear"
            },
            bloequer: {
                text: "Bloquear",
                value: "bloequer",
            },
            cancel: "Cancelar",
            defeat: false,
        },
    }).then((value) => {
        switch (value) {
            case "desbloquear":
                swal({ icon: "/public/spinner.gif", button: false });

                temp.type = 'custom';
                temp.attributes = { data:'RELAY,0#'};

                axios.post('/api/commands/send', temp)
                    .then(function (res) {
                        switch (res.data.id) {
                            case 0:
                                swal("Comando Enviado com Sucesso", {
                                    icon: "success"
                                });
                                break;

                            default:
                                swal("Algo de errado Check console log", {
                                    icon: "warning"
                                });
                                console.log(res.data);
                                break;
                        }

                        console.log(res.data);
                    })                    
                    .catch(function (error) {
                        console.error(error);
                    }); break;
                break;

            case "bloequer":
                swal({ icon: "/public/spinner.gif", button: false });

                temp.type = 'custom';
                temp.attributes = {data:'RELAY,1#'};

                axios.post('/api/commands/send', temp)
                    .then(function (res) {
                        switch (res.data.id) {
                            case 0:
                                swal("Comando Enviado com Sucesso", {
                                    icon: "success"
                                });
                                break;

                            default:
                                swal("Algo de errado Check console log", {
                                    icon: "warning"
                                });
                                console.log(res.data);
                                break;
                        }
                        console.log(res.data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    }); break;

        }
    });
}