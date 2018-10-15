export default function () {
  var c = document.getElementById('matr')
  var ctx = c.getContext('2d')

  //  making the canvas full screen
  // c.height = window.innerHeight;
  c.width = window.innerWidth
  c.height = document.body.clientHeight
  //  c.width = document.body.clientWidth;
  //  chinese characters - taken from the unicode charset
  var matrix = 'CcEeRrIiSs'
  //  converting the string into an array of single characters
  matrix = matrix.split('')

  var fontSize = 10
  var columns = c.width / fontSize // number of columns for the rain
  //  an array of drops - one per column
  var drops = []
  //  x below is the x coordinate
  //  1 = y co-ordinate of the drop(same for every drop initially)
  for (var x = 0; x < columns; x++) {
    drops[x] = 1000 * Math.random()
  }

  //  drawing the characters
  function draw () {
    //  Black BG for the canvas
    //  translucent BG to show trail
    //  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.fillStyle = 'rgba(0, 84, 5, 1)' //  green text
    ctx.font = fontSize + 'px arial'
    //  looping over drops
    for (var i = 0; i < drops.length; i++) {
      //  a random chinese character to print
      var text = matrix[ Math.floor(Math.random() * matrix.length) ]
      //  x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      //  sending the drop back to the top randomly after it has crossed the screen
      //  adding a randomness to the reset to make the drops scattered on the Y axis
      if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      //  incrementing Y coordinate
      drops[i]++
    }
  }
  setInterval(() => {
    draw()
  }, 75)
}
