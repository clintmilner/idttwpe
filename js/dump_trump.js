
$(function () {

    var url = 'https://www.federalregister.gov/api/v1/documents.json?' +
        'conditions[correction]=0' +
        '&conditions[president]=donald-trump' +
        '&conditions[presidential_document_type_id]=2' +
        '&conditions[type]=PRESDOCU' +
        '&order=executive_order_number' +
        '&per_page=1000';
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (data) {
            var start = 1484913600000, // day took office... ugh
                dayInMS = 1000 * 60 * 60 * 24,
                timeNow = new Date().getTime(),
                dayArray = [],
                daysSinceElection = Math.ceil((timeNow - start) / dayInMS),
                offset = 1000 * 60 * 60; // give simultaneous EOs a little bit of offset

            for (var j = 0; j < data.results.length; j++) {
                var date = new Date(data.results[j].publication_date);
                var ms = date.getTime();
                dayArray.push([ms + ( j * offset ), j + 1]);
            }

            $('#eo').highcharts({
                chart: {
                    type: 'spline',
                    backgroundColor: 'rgba(255, 255, 255, 0.45)'
                },
                title: {
                    text: 'Donald Trump Executive Orders',
                    style: {
                        color: '#fff'
                    }
                },
               subtitle: {
                   text: data.results.length + ' Executive Orders in  ' + daysSinceElection + ' Days',
                   style: {
                       color: '#fff'
                   }
               },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        day: '%d %b %Y'
                    },
                    labels: {
                        style: {
                            color: '#fff'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Executive Order Count',
                        style: {
                            color: '#fff'
                        }
                    },
                    labels: {
                        style: {
                            color: '#fff'
                        }
                    },
                    min: 0
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return "<b>Donald Trump's Executive Orders</b><br>" + "#" + this.point.y + " : " + data.results[this.point.y - 1].title;
                    }
                },
                plotOptions: {
                    series: {
                        lineWidth: 3
                    },
                    spline: {
                        marker: {
                            radius: 5,
                            lineColor: '#fff',
                            lineWidth: 3
                        }
                    }
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    text: 'Is Donald Trump the Worst President Ever? <b>YES!</b>',
                    style: {
                        color: '#fff'
                    }
                },
                series: [{
                    name: 'Days Since Inauguration',
                    data: dayArray,
                    marker: {
                        radius: 2,
                        lineColor: '#fff',
                        lineWidth: 2
                    }
                }]
            });
        },
        error: function (msg) {
            console.warn(msg);
        }
    });
});