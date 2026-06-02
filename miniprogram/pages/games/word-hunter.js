Page({
  data: {
    gridSize: 8,
    grid: [],
    words: [],
    foundWords: [],
    foundCount: 0,
    score: 0,
    timeLeft: 120,
    isPlaying: false,
    gameOver: false,
    difficulty: 'easy',
    selectedCells: [],
    currentWord: ''
  },

  onLoad: function () {
    this.startGame()
  },

  startGame: function () {
    var wordSets = {
      easy: ['CAT', 'DOG', 'SUN', 'RUN', 'HAT', 'BAT', 'BOX', 'RED'],
      medium: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'LEMON', 'CHERRY', 'MANGO', 'PEACH'],
      hard: ['ELEPHANT', 'COMPUTER', 'KEYBOARD', 'DINOSAUR', 'MOUNTAIN', 'UNIVERSE', 'CHOCOLATE', 'ADVENTURE']
    }
    
    var words = wordSets[this.data.difficulty]
    var grid = this.generateGrid(words)
    
    this.setData({
      grid: grid,
      words: words,
      foundWords: [],
      foundCount: 0,
      score: 0,
      timeLeft: 120,
      isPlaying: true,
      gameOver: false,
      selectedCells: [],
      currentWord: ''
    })
    
    this.startTimer()
  },

  generateGrid: function (words) {
    var size = 8
    var grid = []
    for (var i = 0; i < size; i++) {
      grid[i] = []
      for (var j = 0; j < size; j++) {
        grid[i][j] = ''
      }
    }
    
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    words.forEach(function(word) {
      var placed = false
      var attempts = 0
      while (!placed && attempts < 100) {
        var dirs = [
          { dx: 0, dy: 1 },
          { dx: 1, dy: 0 },
          { dx: 1, dy: 1 },
          { dx: 1, dy: -1 }
        ]
        var dir = dirs[Math.floor(Math.random() * dirs.length)]
        var startX = Math.floor(Math.random() * size)
        var startY = Math.floor(Math.random() * size)
        
        var endX = startX + (word.length - 1) * dir.dx
        var endY = startY + (word.length - 1) * dir.dy
        
        if (endX >= 0 && endX < size && endY >= 0 && endY < size) {
          var canPlace = true
          for (var i = 0; i < word.length; i++) {
            var x = startX + i * dir.dx
            var y = startY + i * dir.dy
            if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
              canPlace = false
              break
            }
          }
          
          if (canPlace) {
            for (var i = 0; i < word.length; i++) {
              var x = startX + i * dir.dx
              var y = startY + i * dir.dy
              grid[y][x] = word[i]
            }
            placed = true
          }
        }
        attempts++
      }
    })
    
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (grid[y][x] === '') {
          grid[y][x] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
    
    return grid
  },

  startTimer: function () {
    var that = this
    this.timer = setInterval(function() {
      var timeLeft = that.data.timeLeft - 1
      if (timeLeft <= 0) {
        clearInterval(that.timer)
        that.endGame()
      } else {
        that.setData({ timeLeft: timeLeft })
      }
    }, 1000)
  },

  endGame: function () {
    clearInterval(this.timer)
    this.setData({
      isPlaying: false,
      gameOver: true
    })
  },

  selectCell: function (e) {
    if (!this.data.isPlaying) {
      return
    }
    
    var x = parseInt(e.currentTarget.dataset.x)
    var y = parseInt(e.currentTarget.dataset.y)
    
    var isSelected = false
    for (var i = 0; i < this.data.selectedCells.length; i++) {
      var c = this.data.selectedCells[i]
      if (c.x === x && c.y === y) {
        isSelected = true
        break
      }
    }
    
    if (isSelected) {
      var newSelected = []
      for (var i = 0; i < this.data.selectedCells.length; i++) {
        var c = this.data.selectedCells[i]
        newSelected.push(c)
        if (c.x === x && c.y === y) {
          break
        }
      }
      var newWord = ''
      for (var i = 0; i < newSelected.length; i++) {
        var c = newSelected[i]
        newWord += this.data.grid[c.y][c.x]
      }
      
      this.setData({
        selectedCells: newSelected,
        currentWord: newWord
      })
    } else {
      var lastCell = this.data.selectedCells[this.data.selectedCells.length - 1]
      if (lastCell) {
        var dx = Math.abs(x - lastCell.x)
        var dy = Math.abs(y - lastCell.y)
        if (dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
          var newSelected = []
          for (var i = 0; i < this.data.selectedCells.length; i++) {
            newSelected.push(this.data.selectedCells[i])
          }
          newSelected.push({ x: x, y: y })
          
          var newWord = ''
          for (var i = 0; i < newSelected.length; i++) {
            var c = newSelected[i]
            newWord += this.data.grid[c.y][c.x]
          }
          
          this.setData({
            selectedCells: newSelected,
            currentWord: newWord
          })
        }
      } else {
        this.setData({
          selectedCells: [{ x: x, y: y }],
          currentWord: this.data.grid[y][x]
        })
      }
    }
  },

  checkWord: function () {
    var word = this.data.currentWord.toUpperCase()
    var words = this.data.words
    
    var wordIndex = -1
    for (var i = 0; i < words.length; i++) {
      if (words[i] === word) {
        wordIndex = i
        break
      }
    }
    
    var isFound = false
    for (var i = 0; i < this.data.foundWords.length; i++) {
      if (this.data.foundWords[i] === word) {
        isFound = true
        break
      }
    }
    
    if (wordIndex !== -1 && !isFound) {
      var newFoundWords = []
      for (var i = 0; i < this.data.foundWords.length; i++) {
        newFoundWords.push(this.data.foundWords[i])
      }
      newFoundWords.push(word)
      
      this.setData({
        foundWords: newFoundWords,
        foundCount: newFoundWords.length,
        score: this.data.score + word.length * 10,
        selectedCells: [],
        currentWord: ''
      })
      
      if (newFoundWords.length === this.data.words.length) {
        this.endGame()
      }
    } else {
      this.setData({
        selectedCells: [],
        currentWord: ''
      })
    }
  },

  clearSelection: function () {
    this.setData({
      selectedCells: [],
      currentWord: ''
    })
  },

  restart: function () {
    this.startGame()
  },

  goBack: function () {
    wx.navigateBack()
  },

  isWordFound: function (word) {
    return this.data.foundWords.indexOf(word) !== -1
  },

  isCellSelected: function (x, y) {
    for (var i = 0; i < this.data.selectedCells.length; i++) {
      var c = this.data.selectedCells[i]
      if (c.x === x && c.y === y) {
        return true
      }
    }
    return false
  }
})