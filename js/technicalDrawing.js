let backgroundColor = 'white'
let svgContainer = d3.select("body").append("svg")
                                    .attr("width", data.AbsoluteSize.Width)
                                    .attr("height", data.AbsoluteSize.Height)
                                    .attr("x", data.AbsoluteLocation.X)
                                    .attr("y", data.AbsoluteLocation.Y)
                                    .attr('padding', 20);

let background = svgContainer.append('rect')
                            .attr('width', '100%')
                            .attr('height', '100%')
                            .attr('fill', backgroundColor);

for (let visual of data.Children) {
    switch(visual.Type) {
        case C.MeasurementVisual:
            drawMeasurement(visual)
            break;
        case C.ProfileVisual:
            drawProfile(visual)
            break;
        case C.ModuleVisual:
            drawModule(visual)
            break;
        case C.LegendVisual:
            drawLegend(visual)
            break;
        case C.BitmapVisual:
            drawBitmap(visual)
            break;
        default:
            break;
    }
}

function drawProfile({
    ProfileLength,
    ProfileWidth,
    FlangeLength,
    FlangeLengthWithoutEndplate,
    AbsoluteLocation,
    AbsoluteSize,
    Type
}) {
    let rect = svgContainer.append("rect")
                            .attr("x", AbsoluteLocation.X)
                            .attr("y", AbsoluteLocation.Y)
                            .attr("width", AbsoluteSize.Width)
                            .attr("height", AbsoluteSize.Height)
                            .attr('fill', 'darkgray')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 1);
}

function drawMeasurement({
    Number,
    Label,
    ShowWarning,
    Unit,
    Name,
    AbsoluteLocation,
    AbsoluteSize,
    Type,
}) {
    let group = svgContainer.append('g')

    let label = group.append('text')
                    .attr('x', AbsoluteLocation.X + AbsoluteSize.Width / 2)
                    .attr('y', AbsoluteLocation.Y + AbsoluteSize.Height * 3/4)
                    .attr('fill', 'orange')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", AbsoluteSize.Height / 3 + "px")
                    .text(Label + ': ')

    let text = group.append('text')
                    .attr('x', AbsoluteLocation.X + AbsoluteSize.Width / 2)
                    .attr('y', AbsoluteLocation.Y + AbsoluteSize.Height  * 3/4)
                    .attr('fill', 'black')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", AbsoluteSize.Height / 3 + "px")
                    .text(Number + Unit.toLowerCase())
    
    label.attr('x', label.attr('x') - text.node().getComputedTextLength() /2 - label.node().getComputedTextLength() /2)
    text.attr('x', text.attr('x') - text.node().getComputedTextLength() /2 + label.node().getComputedTextLength() /2 + 10)

    let line = group.append("line")
                    .attr("x1", AbsoluteLocation.X)
                    .attr("y1", AbsoluteLocation.Y + AbsoluteSize.Height)
                    .attr("x2", AbsoluteLocation.X + AbsoluteSize.Width)
                    .attr("y2", AbsoluteLocation.Y + AbsoluteSize.Height)
                    .attr("stroke-width", 2)
                    .attr("stroke", "black");

    let leftMiniLine = group.append("line")
                            .attr("x1", AbsoluteLocation.X)
                            .attr("y1", AbsoluteLocation.Y + AbsoluteSize.Height - 5)
                            .attr("x2", AbsoluteLocation.X)
                            .attr("y2", AbsoluteLocation.Y + AbsoluteSize.Height + 5)
                            .attr("stroke-width", 2)
                            .attr("stroke", "black");

    let rightMiniLine = group.append("line")
                            .attr("x1", AbsoluteLocation.X + AbsoluteSize.Width)
                            .attr("y1", AbsoluteLocation.Y + AbsoluteSize.Height - 5)
                            .attr("x2", AbsoluteLocation.X + AbsoluteSize.Width)
                            .attr("y2", AbsoluteLocation.Y + AbsoluteSize.Height + 5)
                            .attr("stroke-width", 2)
                            .attr("stroke", "black");
}

function drawModule({
    PositionInFragment,
    TotalLength,
    LightElementsLeft,
    DistanceToLightLeft,
    LightElementsRight,
    DistanceToLightRight,
    ModuleType,
    IsContinuous,
    Text,
    AbsoluteLocation,
    AbsoluteSize,
    Type
  }) {
    let group = svgContainer.append('g')
    let rect = group.append("rect")
                    .attr("x", AbsoluteLocation.X)
                    .attr("y", AbsoluteLocation.Y)
                    .attr("width", AbsoluteSize.Width)
                    .attr("height", AbsoluteSize.Height)
                    .attr('fill', 'lightgray')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1);

    let circleGroupLeft = group.append('g')
    let circleGroupRight = group.append('g')
    
    drawCircles(LightElementsLeft, DistanceToLightLeft, circleGroupLeft)
    drawCircles(LightElementsRight, AbsoluteSize.Width -  DistanceToLightRight, circleGroupRight)

    let leftCircles = circleGroupLeft.select('circle')
    let rightCircles = circleGroupRight.select('circle')

    drawText()

    function drawText() {
        let r = AbsoluteSize.Height / 2 - 10
        let leftPoint = LightElementsLeft === 0 ? AbsoluteLocation.X : +d3.select(leftCircles._groups[leftCircles._groups.length - 1][0]).attr('cx')  + r
        let rightPoint = LightElementsRight === 0 ? AbsoluteLocation.X + AbsoluteSize.Width : +d3.select(rightCircles._groups[0][0]).attr('cx')  - r

        let text = group.append('text')
                    .attr('x', (rightPoint + leftPoint) / 2)
                    .attr('y', AbsoluteLocation.Y + AbsoluteSize.Height / 2 + 5)
                    .attr('fill', 'black')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "20px")
                    .text(Text)
    
        text.attr('x', text.attr('x') - text.node().getComputedTextLength() /2)
    }

    function drawCircles(elementsNum, distanceToLight, group) {
        for (let i = 0; i < elementsNum; i++) {
            let cx = AbsoluteLocation.X + distanceToLight
            let cy = AbsoluteLocation.Y + AbsoluteSize.Height / 2
            let r = AbsoluteSize.Height / 2 - 10
            let padding = elementsNum === 1 ? 0 : 10*i + i*2*r
            let translation = elementsNum === 1 ? 0 : r * (elementsNum-1) + (5 * (elementsNum - 1))
    
            let circle = group.append('circle')
                                .attr("cx", cx + padding - translation)
                                .attr("cy", cy)
                                .attr("r", r)
                                .style("fill", 'white')
                                .attr('stroke', 'black')
                                .attr('stroke-width', 1);
        }
    }
}

function drawLegend({
    Label,
    Description,
    AbsoluteLocation,
    AbsoluteSize,
    Type,
  }) {
    let group = svgContainer.append('g')

    let label = group.append('text')
                    .attr('x', AbsoluteLocation.X)
                    .attr('y', AbsoluteLocation.Y)
                    .attr('fill', 'orange')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", AbsoluteSize.Height / 2 + "px")
                    .text(Label + ': ')

    let text = group.append('text')
                    .attr('x', AbsoluteLocation.X + label.node().getComputedTextLength() + 10)
                    .attr('y', AbsoluteLocation.Y)
                    .attr('fill', 'black')
                    .attr("font-family", "sans-serif")
                    .attr("font-size", AbsoluteSize.Height / 2 + "px")
                    .text(Description)
}

function drawBitmap({
    SourceUrl,
    BitmapSize,
    Name,
    AbsoluteLocation,
    AbsoluteSize,
    Type
  }) {
    svgContainer.append("svg:image")
                .attr('x', AbsoluteLocation.X)
                .attr('y', AbsoluteLocation.Y)
                .attr('width', AbsoluteSize.Width)
                .attr('height', AbsoluteSize.Height)
                .attr("xlink:href", SourceUrl)
}