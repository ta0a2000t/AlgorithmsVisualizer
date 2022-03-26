
export default class ContextFunctions {
    static maxCharLength = 3

    // x, y is the position of the center of the circle
    static drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
      if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
      }
      if (stroke) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = stroke
        ctx.stroke()
      }
    }

    static centerText(text, maxCharLength) {
      // draw text

      while(text.length < maxCharLength) {
        text = " " + text
        if(text.length >= maxCharLength) {
          break
        }
        //text = text + " " not working
      }
      return text
    }

    // value is an int
    // maxCharLength is the # of chars displayed inside the node
    static drawNode(value, maxCharLength, ctx, x, y, radius, fill, stroke, strokeWidth) {
      ContextFunctions.drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth)
      let innerText = value.toString()

      innerText = ContextFunctions.centerText(innerText, maxCharLength)

      // now innerText is of length maxCharLength
      ctx.fillStyle = "black"
      ctx.fillText(innerText, x - radius/1.5, y + radius/3)

    }


    static drawBox(innerText, ctx, fill, borderColor, borderWidth, x, y, nodeSize) {
      ctx.beginPath()
      ctx.rect(x - borderWidth, y - borderWidth, nodeSize + borderWidth * 2, nodeSize + borderWidth * 2);
      if(borderColor) {
        ctx.fillStyle = borderColor
      } else {
        ctx.fillStyle = "black"
      }
      ctx.fill()

      ctx.beginPath()
      ctx.rect(x, y, nodeSize, nodeSize);
      if(fill) {
        ctx.fillStyle = fill
      } else {
        ctx.fillStyle = "#bfbaba"
      }
      ctx.fill()


      innerText = ContextFunctions.centerText(innerText, ContextFunctions.maxCharLength)
      ctx.fillStyle = "black"
      ctx.fillText(innerText, x + nodeSize * 0.1, y + nodeSize * 0.7)
    }

    static drawNodeArray(ctx, fill, borderColor, borderWidth, blueIndex, redIndex, array, x, y, nodeSize) {
      // draw a box with border
      for(let i = 0; i < array.length; i += 1) {
        let node = array[i]
        let innerText = node.value.toString()
        let currX = x + (nodeSize + borderWidth) * i
        let color = fill
        if(i === blueIndex) {
          color = "blue"
        } else if (i === redIndex) {
          color = "red"
        }
        ContextFunctions.drawBox(innerText, ctx, color, borderColor, borderWidth, currX, y, nodeSize)

        let indexText = ContextFunctions.centerText(i.toString(), ContextFunctions.maxCharLength)

        // draw index above box
        ctx.fillStyle = "black"
        ctx.fillText(indexText, x + 2 + (nodeSize + borderWidth) * i, y - 8)
      }


    }


}
