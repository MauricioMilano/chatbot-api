const { google } = require("googleapis");
/**
     * @param  {} SpreadsheetId ID of the spreaddheet. You can get this by the url 
     * @param  {} options Options needed to authenticate @example {"keyFile":"credentials.json", "scopes": "https://www.googleapis.com/auth/spreadsheets"}
     */
    class SpreadsheetAPI{
    constructor (spreadsheetId, options){
        this.spreadsheetId = spreadsheetId
        this.options = options
        this.auth = new google.auth.GoogleAuth(options);
        this.connect()
    }
    async connect(){ 
      this.client = await this.auth.getClient();
      // Instance of Google Sheets API
      this.googleSheets = google.sheets({ version: "v4", auth: this.client });
    }
    /** This methods returns the metaData from the spreadSheet
     */
    async getMetaData(){
        const metaData = await this.googleSheets.spreadsheets.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
          });
          return metaData
    }
    /**
     * This methods returns the spreadsheet rows that you define the range. 
     * @param  {} range The spreadsheet range @example "Sheet1!A:B"
     */
    async getRows(range){
        const rows = await this.googleSheets.spreadsheets.values.get({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: range,
          });
          return rows
    }
    /** This methods append a row to the spreedsheet. 
     * @param  options @property {range: string, valueInputOption: string, rowAsArray: string}
     * @example {range:"Sheet1!A:B", valueInputOption: "USER_ENTERED", rowAsArray: [foo, bar]}
     * @variation valueInputOption["USER_ENTERED"]
     * 
     */
    async appendRow(options = {range, valueInputOption, rowAsArray}){
        
        await this.googleSheets.spreadsheets.values.append({
            auth: this.auth,
            spreadsheetId: this.spreadsheetId,
            range: options.range,
            valueInputOption: options.valueInputOption,
            resource: {
              values: [options.rowAsArray],
            },
          });
          
    }
}


module.exports = SpreadsheetAPI