
export default class ContextFunctions {

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

    // value is an int
    // maxCharLength is the # of chars displayed inside the node
    static drawNode(value, maxCharLength, ctx, x, y, radius, fill, stroke, strokeWidth) {
      ContextFunctions.drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth)
      let innerText = value.toString()

      while(innerText.length < maxCharLength) {
        innerText = " " + innerText
        if(innerText.length >= maxCharLength) {
          break
        }
        //innerText = innerText + " "
      }
      // now innerText is of length maxCharLength
      ctx.fillStyle = "black"
      ctx.fillText(innerText, x - radius/1.7, y + radius/3)

    }
}
