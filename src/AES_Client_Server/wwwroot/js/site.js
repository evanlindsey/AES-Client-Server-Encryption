// Document Ready
$(document).ready(function () {
    // Initialize Scripts
    var crypto, main;
    $.when($.getScript("./js/aes.js"),
        $.getScript("./js/crypto.js"))
            .done(function () {
                crypto = new Crypto();
                main = new Main(crypto);
                main.initHandlers();
            });
});

function Main(crypto) {
    this.crypto = crypto;
    var that = this;

    // Initialize Click Handlers
    this.initHandlers = function () {
        // Client
        $("#encrypt-client").on("click", that.clientCrypto);
        $("#decrypt-client").on("click", that.clientCrypto);
        // Server
        $("#encrypt-server").on("click", that.serverCrypto);
        $("#decrypt-server").on("click", that.serverCrypto);
        // Cookies
        $("#create-key").on("click", that.createKey);
        $("#set-key").on("click", that.updateKey);
        $("#delete-key").on("click", that.deleteKey);
        // Clear Input/Output
        $("#clear-encrypted").on("click", function () {
            $("#toDecrypt").val("");
        });
        $("#clear-decrypted").on("click", function () {
            $("#toEncrypt").val("");
        });
    };

    // Client Crypto Actions
    this.clientCrypto = function(event) {
        var method = event.target.name;
        var input = $("#to" + method).val();
        if (input != "") {
            var key = that.readKey();
            if (key != null && key.length == 32) {
                if (method == "Encrypt") {
                    var result = that.crypto.encrypt(input, key);
                    $("#toDecrypt").val(result);
                } else if (method == "Decrypt") {
                    var result = that.crypto.decrypt(input, key);
                    $("#toEncrypt").val(result);
                }
                that.showSuccess("Text " + method + "ed on CLIENT");
            } else {
                that.showError("Key Cookie is not Present")
            }
        } else {
            that.showError("Input String is Empty");
        }
    }

    // Server Crypto Actions
    this.serverCrypto = function (event) {
        var method = event.target.name;
        var input = $("#to" + method).val();
        $.get("api/crypto/" + method, { "input": input })
            .done(function (result) {
                if (method == "Encrypt") {
                    $("#toDecrypt").val(result);
                } else if (method == "Decrypt") {
                    $("#toEncrypt").val(result);
                }
                that.showSuccess("Text " + method + "ed on SERVER");
            })
            .fail(function (error) {
                that.showError(error.responseText);
            });
    }

    // Cookie CRUD
    this.createKey = function() {
        var key = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        for (var i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        $("#key").val(key);
        that.showSuccess("Key Created");
    }
    this.readKey = function() {
        var cookies = "; " + document.cookie;
        cookies = cookies.split("; key=");
        if (cookies.length == 2) {
            var key = cookies[1].split(";")[0];
            return key;
        } else {
            return null;
        }
    }
    this.updateKey = function() {
        var key = $("#key").val();
        if (key.length == 32) {
            document.cookie = "key=" + key;
            that.showSuccess("Key Cookie Set");
        } else {
            that.showError("Key Must Be 32 Characters");
        }
    }
    this.deleteKey = function() {
        document.cookie = "key=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $("#key").val("");
        that.showSuccess("Key Cookie Deleted")
    }

    // Show Messages
    this.showSuccess = function(success) {
        $("#error").empty();
        $("#success").html(success);
    }
    this.showError = function(error) {
        $("#success").empty();
        $("#error").html("ERROR: " + error);
    }
};
