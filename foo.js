let languages = ["C++", "Python", "Java", "C#", "Go"];

// construct the insert statement with multiple placeholders
// based on the number of rows
let placeholders = languages.map(language => "(?)").join(",");
let sql = "INSERT INTO langs(name) VALUES " + placeholders;

// output the INSERT statement
console.log(sql);
