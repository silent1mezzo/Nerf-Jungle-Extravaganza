var db = window.openDatabase("scores", "1.0", "Stores the high scores for players", 1*1024*1024);

function createTable() {
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE scores (id REAL UNIQUE, name TEXT, score TEXT)");
    });
}

function addScore(name, score) {
    var num = Math.round(Math.random() * 100000);
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO scores (id, name, score) VALUES (?, ?, ?)", [num, name, score]);
    });
}

function deleteScore(id) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM scores WHERE id=?", [id]);
    });
}

function showScores() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM scores ORDER BY score", [], function(tx, result) {
            for (var i = 0, item = null; i < result.rows.length; i++) {
                item = result.rows.item(i);
                console.log(item['name'] + ": " + item['score']);
            }
        });
    });
}

db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM scores ORDER BY score", [], function(tx, result) {
        for (var i = 0, item = null; i < result.rows.length; i++) {
            item = result.rows.item(i);
            document.getElementById('scores').innerHTML +=
            '<li>' + item['name'] + ': ' + item['score'] + '</li>';
        }
    });
});
