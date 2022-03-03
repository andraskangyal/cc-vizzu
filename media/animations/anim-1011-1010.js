function anim_1011_1010(chart) {

    return chart.animate({
        config: {
            channels: {
                y: { set: ['Language'], range: { min: '0%', max: '100%' } },
                x: { set: ['Line count', 'File name'] },
                color: 'Language',
                label: null
            },
            title: null, //  '5 code + types 3'
            legend: null,
            reverse: false,
            sort: 'byValue'
        },
        style: {
            plot: {
                paddingLeft: '9em',
                yAxis: { label: { fontSize: '0em', paddingRight: '1.2em' } },
                xAxis: { label: { angle: 0 } }
            }
        }
    },
        { duration: 2 }
    )

        .then(chart => chart.animate({
            config: {
                channels: {
                    y: { set: ['Language'], range: { min: '0%', max: '100%' } },
                    x: { set: ['Line count'] },
                    color: 'Language',
                    label: { set: ['Line count'] },
                },
                title: null, //  '4 code + types 2',
                legend: null,
                reverse: false,
                sort: 'byValue'
            },
            style: {
                plot: {
                    paddingLeft: '9em',
                    marker: { label: { position: 'right' } },
                    yAxis: { label: { fontSize: '1em', paddingRight: '1.2em' } },
                    xAxis: { label: { angle: 0 } }
                }
            }
        },
            { duration: 0.5 }
        ));
}