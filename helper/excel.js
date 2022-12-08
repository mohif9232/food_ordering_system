let exceljs = require("exceljs")

// async function excel(request, response, filename, columns, Data) {
//     let workbook = new exceljs.Workbook();
//     let worksheet = workbook.addWorksheet(filename)
//     worksheet.columns = columns;

//     worksheet.addRows(Data)
//     worksheet.getRow(1).eachCell((cell) => {
//         cell.font = { bold: true }
//     })

//     await workbook.xlsx.writeFile(`${filename}.xlsx`).then((data) => {
//         return response.status(200).send(true)
//     }).catch((err) => {
//         return response.status(500).send({ error: false })
//     })
// }
// module.exports = excel



// for downloading the file from browser 
async function excel(request, response, filename, columns, userData) {
    let workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet(filename)
    worksheet.columns = columns;

    worksheet.addRows(userData)
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true }
    })

    response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`)

    await workbook.xlsx.writeBuffer(`${filename}.xlsx`).then((data) => {
        return response.status(200).send(true)
    }).catch((err) => {
        return response.status(500).send(false)
    })
}
module.exports = excel