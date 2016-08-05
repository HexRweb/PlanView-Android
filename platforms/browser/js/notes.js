function myFunction() {
    var firstnotes = document.getElementById('firstnotes').value;
    window.localStorage.setItem("fnotes", firstnotes);
    var firstnotesResults = window.localStorage.getItem("fnotes");
    document.getElementById('result').innerHTML = firstnotesResults;
}
