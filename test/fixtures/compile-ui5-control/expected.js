"use strict";

sap.ui.define("babel/test/test/fixtures/compile-ui5-control/actual", ["sap/ui/core/Control", "sap/m/Table", "sap/m/ColumnListItem", "sap/m/ObjectNumber", "sap/m/Column", "sap/m/Toolbar", "sap/m/Title", "sap/m/Text", "sap/m/ToolbarSpacer", "sap/m/SearchField", "sap/m/ObjectIdentifier", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../model/formatter"], function (Control, Table, ColumnListItem, ObjectNumber, Column, Toolbar, Title, Text, ToolbarSpacer, SearchField, ObjectIdentifier, JSONModel, Filter, FilterOperator, formatter) {
  var createFormatter = formatter.createFormatter;
  var _default = {};
  var InvoiceList = Control.extend("babel.test.test.fixtures.compile-ui5-control.actual", {
    metadata: {
      properties: {
        nav: {
          type: "function"
        }
      },
      aggregations: {
        table: {
          type: "sap.ui.core.Control",
          multiple: false
        }
      }
    },
    onFilterInvoices: function onFilterInvoices(oEvent) {
      // build filter array
      var aFilter = [];
      var sQuery = oEvent.getParameter("query");

      if (sQuery) {
        aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
      } // filter binding


      var oBinding = this.getAggregation("table").getBinding("items");
      oBinding.filter(aFilter);
    },
    onPress: function onPress(oEvent) {
      var nav = this.getProperty("nav");

      if (nav) {
        var oItem = oEvent.getSource();
        var invoicePath = oItem.getBindingContext("invoice").getPath().substr(1);
        nav({
          invoicePath: invoicePath
        });
      }
    },
    renderColumns: function renderColumns() {
      return [new Column({
        hAlign: "End",
        minScreenWidth: "Small",
        demandPopin: true,
        width: "4em",
        header: new Text({
          text: "{i18n>columnQuantity}"
        })
      }), new Column({
        header: new Text({
          text: "{i18n>columnName}"
        })
      }), new Column({
        minScreenWidth: "Small",
        demandPopin: true,
        header: new Text({
          text: "{i18n>columnStatus}"
        })
      }), new Column({
        minScreenWidth: "Tablet",
        demandPopin: false,
        header: new Text({
          text: "{i18n>columnSupplier}"
        })
      }), new Column({
        hAlign: "End",
        header: new Text({
          text: "{i18n>columnPrice}"
        })
      })];
    },
    renderItemsTemplate: function renderItemsTemplate() {
      return new ColumnListItem({
        type: "Navigation",
        press: this.onPress.bind(this),
        cells: [new ObjectNumber({
          number: "{invoice>Quantity}",
          emphasized: false
        }), new ObjectIdentifier({
          title: "{invoice>ProductName}"
        }), new Text({
          text: {
            path: "invoice>Status",
            formatter: this._formatter.statusText
          }
        }), new Text({
          text: "{invoice>ShipperName}"
        }), new ObjectNumber({
          number: {
            parts: [{
              path: "invoice>ExtendedPrice"
            }, {
              path: "view>/currency"
            }],
            type: "sap.ui.model.type.Currency",
            formatOptions: {
              showMeasure: false
            }
          },
          unit: "{view>/currency}",
          state: "{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"
        })]
      });
    },
    init: function init() {
      var oViewModel = new JSONModel({
        currency: "EUR"
      });
      this.setModel(oViewModel, "view");
      this._formatter = createFormatter(this);
      this.setAggregation("table", new Table({
        width: "auto",
        headerToolbar: new Toolbar({
          content: [new Title({
            text: "A Header Here"
          }), new ToolbarSpacer({}), new SearchField({
            width: "50%",
            search: this.onFilterInvoices.bind(this),
            selectOnFocus: false
          })]
        }),
        columns: this.renderColumns(),
        items: {
          path: "invoice>/Invoices",
          template: this.renderItemsTemplate(),
          sorter: {
            path: "ShipperName",
            group: true
          }
        }
      }).addStyleClass("sapUiResponsiveMargin"));
    },
    renderer: function renderer(oRM, oControl) {
      oRM.renderControl(oControl.getAggregation("table"));
    }
  });
  _default.InvoiceList = InvoiceList;
  return _default;
})