// =========================
//   VARIABLES PRINCIPALES
// =========================
const navItems = document.querySelectorAll('.nav-item');
const activeLine = document.querySelector('.active-line');

const modals = {
    conteo: document.getElementById("modal"),
    pedidos: document.getElementById("modal-pedidos"),
    areas: document.getElementById("modal-areas"),
    ventas: document.getElementById("modal-ventas"),
    cortesias: document.getElementById("modal-cortesias"),
    mesas: document.getElementById("modal-mesas"),
    final: document.getElementById("modal-final")
};

const closeBtn = document.querySelectorAll(".close-btn");
const saveAllBtn = document.createElement("button");
saveAllBtn.textContent = "Guardar Todo";
saveAllBtn.classList.add("add-product-btn");
document.getElementById("panel").appendChild(saveAllBtn);
const cuadrarBtn = document.createElement("button");
cuadrarBtn.textContent = "Cuadrar Productos";
cuadrarBtn.classList.add("add-product-btn");
document.getElementById("panel").appendChild(cuadrarBtn);
// =========================
//     LOGIN FUNCIONAL
// =========================
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    const users = { "almacen": "sopa", "jefe": "admin" };

    if (users[user] && users[user] === pass) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("panel").style.display = "block";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
});

// =========================
//     MOSTRAR MODALES
// =========================
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        Object.values(modals).forEach(m => m.style.display = "none");
        const keys = Object.keys(modals);
        modals[keys[index]].style.display = "flex";

        document.querySelector('.active')?.classList.remove('active');
        item.classList.add('active');

        navItems.forEach(i => i.querySelectorAll('span').forEach(span => span.style.color = "#b5b5b5"));
        const spans = item.querySelectorAll('span');
        spans.forEach((span, i) => setTimeout(() => { span.style.transition='0.3s'; span.style.color='#fff'; }, i*30));

        activeLine.style.width = item.offsetWidth + "px";
        activeLine.style.left = item.offsetLeft + "px";
    });
});

// =========================
//        CERRAR MODALES
// =========================
// =========================
//        CERRAR MODALES
// =========================
closeBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        Object.values(modals).forEach(m => {
            m.style.display = "none";

            // Cerrar todos los selects dentro del modal
            m.querySelectorAll(".select-options").forEach(select => {
                select.style.display = "none";
            });
        });
    });
});

window.onclick = function(event) {
    if (Object.values(modals).includes(event.target)) {
        Object.values(modals).forEach(m => {
            m.style.display = "none";

            // Cerrar todos los selects dentro del modal
            m.querySelectorAll(".select-options").forEach(select => {
                select.style.display = "none";
            });
        });
    }
};

// =========================
//   FUNCIONES DE PRODUCTOS
// =========================
function getListaProductos() {
    const conteo = document.querySelectorAll("#conteo-body tr td:first-child");
    return [...conteo].map(td => td.textContent.trim());
}

function crearSelectProductos(valorSeleccionado = "") {
    const productos = getListaProductos();

    const wrapper = document.createElement("div");
    wrapper.className = "select-wrapper";

    const display = document.createElement("div");
    display.className = "select-display";
    display.textContent = valorSeleccionado || "Seleccionar producto";

    const opciones = document.createElement("div");
    opciones.className = "select-options";

    // Opciones
    productos.forEach(prod => {
        const opt = document.createElement("div");
        opt.className = "select-option";
        opt.textContent = prod;

        opt.onclick = () => {
            display.textContent = prod;
            wrapper.value = prod;
            opciones.style.display = "none";
            wrapper.dispatchEvent(new Event("change"));
        };

        opciones.appendChild(opt);
    });

    // Toggle: abrir o cerrar select al hacer clic
    display.onclick = (e) => {
        e.stopPropagation();
        opciones.style.display = opciones.style.display === "block" ? "none" : "block";
    };

    // Cerrar select si se hace clic fuera
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            opciones.style.display = "none";
        }
    });

    wrapper.appendChild(display);
    wrapper.appendChild(opciones);
    wrapper.value = valorSeleccionado;

    return wrapper;
}

function createRow(cells, editable=true) {
    const row = document.createElement("tr");
    cells.forEach(text => {
        const td = document.createElement("td");
        td.textContent = text;
        if(editable) td.contentEditable = "true";
        row.appendChild(td);
    });
    return row;
}
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000); // 5 segundos
}

// =========================
//      AREAS Y VENTAS
// =========================
function addProduct(areaId) {
    const tbody = document.getElementById(`${areaId}-body`);
    const row = document.createElement("tr");

    const tdProd = document.createElement("td");
    tdProd.appendChild(crearSelectProductos());

    const tdEntregada = document.createElement("td");
    const tdDevuelta = document.createElement("td");
    const tdUso = document.createElement("td");
    tdEntregada.contentEditable = true;
    tdDevuelta.contentEditable = true;
    tdUso.textContent = "0";
    tdUso.style.fontWeight = "bold";

    function calcularUso() {
        const e = parseFloat(tdEntregada.textContent)||0;
        const d = parseFloat(tdDevuelta.textContent)||0;
        tdUso.textContent = e-d;
        saveArea(areaId);
    }

    tdEntregada.oninput = calcularUso;
    tdDevuelta.oninput = calcularUso;

    row.appendChild(tdProd);
    row.appendChild(tdEntregada);
    row.appendChild(tdDevuelta);
    row.appendChild(tdUso);
    tbody.appendChild(row);

    saveArea(areaId);
}

function addVenta() {
    const tbody = document.getElementById("ventas-body");
    const tr = document.createElement("tr");

    const tdProd = document.createElement("td");
    tdProd.appendChild(crearSelectProductos());

    const tdCant = document.createElement("td");
    tdCant.contentEditable = "true";

    tr.appendChild(tdProd);
    tr.appendChild(tdCant);

    tbody.appendChild(tr);
    saveArea("ventas");
}

function addCortesia() {
    const tbody = document.getElementById("cortesias-body");
    const tr = document.createElement("tr");

    // --- Celda producto ---
    const tdProd = document.createElement("td");
    tdProd.appendChild(crearSelectProductos());

    // --- Celda cantidad ---
    const tdCant = document.createElement("td");
    tdCant.contentEditable = "true";
    tdCant.textContent = "0"; // para que aparezca visible como campo

    // Añadir celdas a la fila
    tr.appendChild(tdProd);
    tr.appendChild(tdCant);

    // Añadir fila
    tbody.appendChild(tr);

    // Guardado automático
    saveArea("cortesias");
}

function addMesa() {
    const tbody = document.getElementById("mesas-body");
    const tr = document.createElement("tr");

    const tdProd = document.createElement("td");
    tdProd.appendChild(crearSelectProductos());

    const tdCant = document.createElement("td");
    tdCant.contentEditable = "true";

    tr.appendChild(tdProd);
    tr.appendChild(tdCant);

    tbody.appendChild(tr);
    saveArea("mesas");
}

function addFinal(areaId) {
    const tbody = document.getElementById(`${areaId}-body`);
    const tr = document.createElement("tr");

    const tdProd = document.createElement("td");
    tdProd.appendChild(crearSelectProductos());

    const tdCant = document.createElement("td");
    tdCant.contentEditable = "true";

    tr.appendChild(tdProd);
    tr.appendChild(tdCant);

    tbody.appendChild(tr);
    saveArea(areaId);
}

// =========================
//      GUARDAR Y CARGAR
// =========================
function saveArea(areaId) {
    const tbody = document.getElementById(`${areaId}-body`);
    if(!tbody) return;

    const rows = [...tbody.querySelectorAll("tr")].map(tr => {
        const tds = tr.querySelectorAll("td");
        return [...tds].map(td => {
            const select = td.querySelector(".select-wrapper");
            if(select) return select.value;
            return td.textContent;
        });
    });

    localStorage.setItem(areaId, JSON.stringify(rows));
}

function loadArea(areaId) {
    const tbody = document.getElementById(`${areaId}-body`);
    if(!tbody) return;

    const data = JSON.parse(localStorage.getItem(areaId) || "[]");
    if(data.length === 0) return;

    tbody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach((text, i) => {
            const td = document.createElement("td");

            if(i === 0 && (tbody.id.includes("area") || tbody.id.includes("ventas") || tbody.id.includes("mesas") || tbody.id.includes("final") || tbody.id.includes("cortesias"))) {
                td.appendChild(crearSelectProductos(text));
            } else {
                td.textContent = text;
                td.contentEditable = true;

                if(i === 1 || i === 2) {
                    td.oninput = () => {
                        const entregada = tr.children[1];
                        const devuelta = tr.children[2];
                        const uso = tr.children[3];
                        const e = parseFloat(entregada.textContent)||0;
                        const d = parseFloat(devuelta.textContent)||0;
                        uso.textContent = e - d;
                        saveArea(areaId);
                    };
                }
            }

            tr.appendChild(td);
        });

        if(tbody.id.includes("area")) {
            const tdUso = tr.children[3] || document.createElement("td");
            tdUso.style.fontWeight = "bold";
            if(!tr.children[3]) tr.appendChild(tdUso);

            const e = parseFloat(tr.children[1].textContent)||0;
            const d = parseFloat(tr.children[2].textContent)||0;
            tdUso.textContent = e - d;
        }

        tbody.appendChild(tr);
    });
}

// =========================
//      BOTONES PRINCIPALES
// =========================
saveAllBtn.addEventListener("click", () => {
    const allAreas = [
        "conteo","pedidos",
        "area-basines","area-cumpleanos","area-vasos",
        "ventas","mesas","cortesias",
        "final-pacena","final-monster","final-schweppes","final-deposito","final-lavaplatos"
    ];
    allAreas.forEach(areaId => saveArea(areaId));
    showToast("💾 Datos guardados exitosamente");

});

cuadrarBtn.addEventListener("click", () => {
    const consumoAreas = [
        "area-basines","area-cumpleanos","area-vasos",
        "ventas","mesas","cortesias"
    ];

    const conteoData = JSON.parse(localStorage.getItem("conteo") || "[]");
    const pedidosData = JSON.parse(localStorage.getItem("pedidos") || "[]");

    const totalInicial = {};
    conteoData.forEach(row => {
        const producto = row[0].trim();
        const cantidad = parseFloat(row[1]) || 0;
        totalInicial[producto] = cantidad;
    });
    pedidosData.forEach(row => {
        const producto = row[0].trim();
        const cantidad = parseFloat(row[1]) || 0;
        if(totalInicial[producto] !== undefined){
            totalInicial[producto] += cantidad;
        } else {
            totalInicial[producto] = cantidad;
        }
    });

    consumoAreas.forEach(area => {
        const areaData = JSON.parse(localStorage.getItem(area) || "[]");
        areaData.forEach(row => {
            const producto = row[0].trim();
            let uso = 0;

            if(area === "ventas" || area === "mesas" || area === "cortesias") {
                uso = parseFloat(row[1]) || 0;
            } else {
                const entregada = parseFloat(row[1]) || 0;
                const devuelta = parseFloat(row[2]) || 0;
                uso = entregada - devuelta;
            }

            if(totalInicial[producto] !== undefined){
                totalInicial[producto] -= uso;
            }
        });
    });

    const finales = ["final-pacena","final-monster","final-schweppes","final-deposito","final-lavaplatos"];
    const reporte = {};

    finales.forEach(finalArea => {
        const finalData = JSON.parse(localStorage.getItem(finalArea) || "[]");
        finalData.forEach(row => {
            const producto = row[0].trim();
            const cantidadFinal = parseFloat(row[1]) || 0;
            if(!reporte[producto]) reporte[producto] = { esperado: totalInicial[producto] || 0, final: 0 };
            reporte[producto].final += cantidadFinal;
        });
    });

    const tbody = document.querySelector("#reporte-cuadre tbody");
    tbody.innerHTML = "";
    Object.keys(reporte).forEach(producto => {
        const r = reporte[producto];
        const tr = document.createElement("tr");
        const diferencia = r.final - r.esperado;

        let textoDiferencia = "";
        let color = "";

        if(diferencia === 0){
            textoDiferencia = `✅ Cuadra`;
            color = "lightgreen";
        } else if(diferencia > 0){
            textoDiferencia = `⚠️ Sobrante: ${diferencia}`;
            color = "orange";
        } else {
            textoDiferencia = `❌ Faltante: ${Math.abs(diferencia)}`;
            color = "red";
        }

        tr.innerHTML = `
            <td>${producto}</td>
            <td>${r.esperado}</td>
            <td>${r.final}</td>
            <td style="color:${color}; font-weight:bold;">${textoDiferencia}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("modal-cuadre").style.display = "flex";
});

document.getElementById("close-cuadre").addEventListener("click", () => {
    document.getElementById("modal-cuadre").style.display = "none";
});
window.addEventListener("click", (e) => {
    if(e.target.id === "modal-cuadre"){
        document.getElementById("modal-cuadre").style.display = "none";
    }
});

// =========================
//        CARGA INICIAL
// =========================
window.onload = () => {
    const areas = [
        "conteo","pedidos",
        "area-basines","area-cumpleanos","area-vasos",
        "ventas","mesas","cortesias",
        "final-pacena","final-monster","final-schweppes","final-deposito","final-lavaplatos"
    ];
    areas.forEach(area => loadArea(area));

    navItems.forEach(item => {
        const text = item.textContent;
        item.textContent = "";
        text.split("").forEach(letter => {
            const span = document.createElement("span");
            span.textContent = letter;
            item.appendChild(span);
        });
    });
};

// =========================
//     BOTON "REINICIAR TODO"
// =========================
document.getElementById("reset-all-btn").addEventListener("click", () => {
    const areas = [
        "conteo","pedidos",
        "area-basines","area-cumpleanos","area-vasos",
        "ventas","mesas","cortesias",
        "final-pacena","final-monster","final-schweppes","final-deposito","final-lavaplatos"
    ];

    areas.forEach(area => localStorage.removeItem(area));

    areas.forEach(area => {
        const tbody = document.getElementById(`${area}-body`);
        if(tbody) {
            if(area === "conteo" || area === "pedidos") {
                tbody.querySelectorAll("tr").forEach(tr => {
                    tr.querySelectorAll("td").forEach((td, i) => {
                        if(i > 0) td.textContent = "";
                    });
                });
            } else {
                tbody.innerHTML = "";
            }
        }
    });

    showToast("✔ Todo se ha reiniciado correctamente");
});
// =========================
//   GENERAR PDF DEL CUADRE
// =========================


document.getElementById("download-pdf-btn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const logo = new Image();
    logo.src = "1763002036643.png"; 

    const now = new Date();
    const fecha = now.toLocaleDateString("es-ES");
    const hora = now.toLocaleTimeString("es-ES");

    logo.onload = () => {

        const drawHeader = () => {
            // Logo más grande
            doc.addImage(logo, "PNG", 10, 10, 40, 40);

            // Titulo
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("PACHA SUNSET", 60, 25);

            // Fecha y hora
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Fecha: ${fecha}   Hora: ${hora}`, 60, 35);
        };

        drawHeader(); // Primera página

        // -------------------------
        // ARMAR TABLA
        // -------------------------
        const rows = [];
        document.querySelectorAll("#reporte-cuadre tbody tr").forEach(tr => {
            const prod = tr.children[0].textContent.trim();
            const esperado = parseFloat(tr.children[1].textContent.trim());
            const final = parseFloat(tr.children[2].textContent.trim());

            let estado = "";
            let cantidad = 0;

            if (final > esperado) {
                estado = "Sobrante";
                cantidad = final - esperado;
            } else if (final < esperado) {
                estado = "Faltante";
                cantidad = esperado - final;
            } else {
                estado = "Cuadra";
                cantidad = 0;
            }

            rows.push([prod, esperado, final, estado, cantidad]);
        });

        // -------------------------
        // TABLA PDF CON COLORES
        // -------------------------
        doc.autoTable({
            startY: 50,
            head: [["Producto", "Esperado", "Final", "Estado", "Cantidad"]],
            body: rows,
            styles: { fontSize: 14, cellPadding: 4, halign: "center" },
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 14 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 15 },

            didParseCell: function (data) {
                // Solo colorear la columna Estado (índice 3)
                if (data.column.index === 3 && data.cell.section === 'body') {
                    const val = data.cell.raw;
                    if (val === "Faltante") data.cell.styles.textColor = [255, 0, 0];       // rojo brillante
                    if (val === "Sobrante") data.cell.styles.textColor = [255, 165, 0];     // naranja
                    if (val === "Cuadra") data.cell.styles.textColor = [0, 128, 0];         // verde llamativo
                    data.cell.styles.fontStyle = 'bold';
                }
            },

            didDrawPage: function (data) {
                // Solo en la primera página se dibuja encabezado completo
                if (data.pageNumber === 1) drawHeader();
            }
        });

        doc.save("Reporte_producto_PACHA.pdf");
    };
});
// =========================
//   PDF CONTEO + PEDIDOS
// =========================

document.getElementById("btn-pdf-conteo").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const logo = new Image();
    logo.src = "1763002036643.png";

    const now = new Date();
    const fecha = now.toLocaleDateString("es-ES");
    const hora = now.toLocaleTimeString("es-ES");

    logo.onload = () => {

        // Header
        doc.addImage(logo, "PNG", 10, 10, 40, 40);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("PACHA SUNSET", 60, 25);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha: ${fecha}   Hora: ${hora}`, 60, 35);


        // ============================
        //   SUMAR CONTEO + PEDIDOS
        // ============================

        const total = {};

        // --- Conteo Inicial ---
        document.querySelectorAll("#conteo-body tr").forEach(tr => {
            const prod = tr.children[0].textContent.trim();
            const cant = parseFloat(tr.children[1]?.textContent.trim()) || 0;

            if (!total[prod]) total[prod] = 0;
            total[prod] += cant;
        });

        // --- Pedidos Nuevos ---
        document.querySelectorAll("#pedidos-body tr").forEach(tr => {
            const prod = tr.children[0].textContent.trim();
            const cant = parseFloat(tr.children[1]?.textContent.trim()) || 0;

            if (!total[prod]) total[prod] = 0;
            total[prod] += cant;
        });

        // Convertir objeto → tabla
        const rows = Object.keys(total).map(prod => [
            prod,
            total[prod]
        ]);

        // ============================
        //        TABLA PDF
        // ============================
        doc.autoTable({
            startY: 55,
            head: [["Producto", "Cantidad Total (Inicial + Pedidos)"]],
            body: rows,
            styles: { fontSize: 13, cellPadding: 4, halign: "center" },
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
        });

        doc.save("Conteo_Inicial_Completo_PACHA.pdf");
    };

});
// BOTÓN GUARDAR
document.getElementById("btn-guardar").addEventListener("click", () => {
    showToast("💾 Datos guardados correctamente");
    // aquí va tu lógica de guardar
});

// BOTÓN CUADRAR
document.getElementById("btn-cuadrar").addEventListener("click", () => {
    showToast("📊 Generando Cuadre...");
    // aquí puedes llamar tu función del modal de cuadre
});

// BOTÓN RESETEAR
document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("¿Seguro deseas reiniciar todos los datos?")) {
        showToast("♻ Datos reiniciados");
        // aquí va tu función de reinicio
    }
});
