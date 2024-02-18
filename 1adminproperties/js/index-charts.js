'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#75c181',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed',
	blue:'#668cff'
};


/* Random number generator for demo purpose */
//var randomDataPoint = function(){ return Math.round(Math.random()*10000)};

let JanProfit=document.getElementById('Jan').value;
let FebProfit=document.getElementById('Feb').value;
let MarProfit=document.getElementById('Mar').value;
let AprProfit=document.getElementById('Apr').value;
let MayProfit=document.getElementById('May').value;
let JunProfit=document.getElementById('Jun').value;
let JulProfit=document.getElementById('Jul').value;
let AugProfit=document.getElementById('Aug').value;
let SepProfit=document.getElementById('Sep').value;
let OctProfit=document.getElementById('Oct').value;
let NovProfit=document.getElementById('Nov').value;
let DecProfit=document.getElementById('Dec').value;

//console.log(JanProfit);


let JanUser=document.getElementById('UserJan').value;
let FebUser=document.getElementById('UserFeb').value;
let MarUser=document.getElementById('UserMar').value;
let AprUser=document.getElementById('UserApr').value;
let MayUser=document.getElementById('UserMay').value;
let JunUser=document.getElementById('UserJun').value;
let JulUser=document.getElementById('UserJul').value;
let AugUser=document.getElementById('UserAug').value;
let SepUser=document.getElementById('UserSep').value;
let OctUser=document.getElementById('UserOct').value;
let NovUser=document.getElementById('UserNov').value;
let DecUser=document.getElementById('UserDec').value;

let orderJan=document.getElementById('orderJan').value;
let orderFeb=document.getElementById('orderFeb').value;
let orderMar=document.getElementById('orderMar').value;
let orderApr=document.getElementById('orderApr').value;
let orderMay=document.getElementById('orderMay').value;
let orderJun=document.getElementById('orderJun').value;
let orderJul=document.getElementById('orderJul').value;
let orderAug=document.getElementById('orderAug').value;
let orderSep=document.getElementById('orderSep').value;
let orderOct=document.getElementById('orderOct').value;
let orderNov=document.getElementById('orderNov').value;
 let orderDec=document.getElementById('orderDec').value;
//Chart.js Line Chart Example 




let profit2018=document.getElementById('2018').value;
let profit2019=document.getElementById('2019').value;
let profit2020=document.getElementById('2020').value;
let profit2021=document.getElementById('2021').value;
let profit2022=document.getElementById('2022').value;
let profit2023=document.getElementById('2023').value;
let profit2024=document.getElementById('2024').value;


let user2018=document.getElementById('user2018').value;
let user2019=document.getElementById('user2019').value;
let user2020=document.getElementById('user2020').value;
let user2021=document.getElementById('user2021').value;
let user2022=document.getElementById('user2022').value;
let user2023=document.getElementById('user2023').value;
let user2024=document.getElementById('user2024').value;

let order2018=document.getElementById('order2018').value;
let order2019=document.getElementById('order2019').value;
let order2020=document.getElementById('order2020').value;
let order2021=document.getElementById('order2021').value;
let order2022=document.getElementById('order2022').value;
let order2023=document.getElementById('order2023').value;
let order2024=document.getElementById('order2024').value;




// const filterSelect = document.getElementById('filterSelect');

// filterSelect.addEventListener('change', handleFilterChange);

// function handleFilterChange() {
//     const selectedValue = filterSelect.value;
//     if (selectedValue === 'month') {
       
//         // Your code for handling month filter
//     } else if (selectedValue === 'year') {
// 		monthlyDatas()
//         console.log('This Year selected');
//         // Your code for handling year filter
//     }
// }

	


var lineChartConfig

 lineChartConfig = {
	type: 'line',

	data: {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'],
		
		datasets: [{
			label: 'Totel Profit',
			fill: false,
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			data: [
				JanProfit,
				FebProfit,
				MarProfit,
				AprProfit,
				MarProfit,
				JunProfit,
				JulProfit,
				AugProfit,
				SepProfit,
				OctProfit,
				NovProfit,
				DecProfit,
			],
		},
	    {
			label: 'Totel Users',
		   // borderDash: [5, 5],
			backgroundColor: window.chartColors.gray,
			borderColor: window.chartColors.gray,
			
			data: [
				JanUser,
				FebUser,
				MarUser,
				AprUser,
				MarUser,
				JunUser,
				JulUser,
				AugUser,
				SepUser,
				OctUser,
				NovUser,
				DecUser,
			],
			fill: false,
		},
		{
			label: 'Totel Order',
		   // borderDash: [5, 5],
			backgroundColor: window.chartColors.blue,
			borderColor: window.chartColors.blue,
			
			data: [
				orderJan,
				orderFeb,
				orderMar,
				orderApr,
				orderMar,
				orderJun,
				orderJul,
				orderAug,
				orderSep,
				orderOct,
				orderNov,
				orderDec,
			],
			fill: false,
		}
	]
	},



	options: {
		responsive: true,	
		aspectRatio: 1.5,
		
		legend: {
			display: true,
			position: 'bottom',
			align: 'end',
		},
		
		title: {
			display: true,
			text: '',
			
		}, 
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#ffff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

            callbacks: {
	            //Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
                label: function(tooltipItem, data) {
	                if (parseInt(tooltipItem.value) >= 1000) {
                        return "₹" + tooltipItem.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    } else {
	                    return '' + tooltipItem.value;
                    }
                }
            },

		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,
				
				}
			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,
				},
				ticks: {
		            beginAtZero: true,
		            userCallback: function(value, index, values) {
		                return '' + value.toLocaleString();   //Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
		            }
		        },
			}]
		}
	}
};











// Chart.js Bar Chart Example 

var barChartConfig = {
	type: 'bar',

	data: {
		labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
		datasets: [{
			label: 'Totel Profit',
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			borderWidth: 1,
			maxBarThickness: 16,
			
			data: [
				profit2018,
				profit2019,
				profit2020,
				profit2021,
				profit2022,
				profit2023,
				profit2024,
				
			]
		},
		{
			label: 'Totel Users',
			backgroundColor: window.chartColors.gray,
			borderColor: window.chartColors.gray,
			borderWidth: 1,
			maxBarThickness: 16,
			
			data: [
				user2018,
				user2019,
				user2020,
				user2021,
				user2022,
				user2023,
				user2024
			]
		},
		{
			label: 'Totel Order',
			backgroundColor: window.chartColors.blue,
			borderColor: window.chartColors.blue,
			borderWidth: 1,
			maxBarThickness: 16,
			
			data: [
				order2018,
				order2019,
				order2020,
				order2021,
				order2022,
				order2023,
				order2024,
				
			]
		}
	]
	},
	options: {
		responsive: true,
		aspectRatio: 1.5,
		legend: {
			position: 'bottom',
			align: 'end',
		},
		title: {
			display: true,
			text: ''
		},
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#fff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},

			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.borders,
				},

				
			}]
		}
		
	}
}







// Generate charts on load
window.addEventListener('load', function(){
	
	var lineChart = document.getElementById('canvas-linechart').getContext('2d');
	window.myLine = new Chart(lineChart, lineChartConfig);
	
	var barChart = document.getElementById('canvas-barchart').getContext('2d');
	window.myBar = new Chart(barChart, barChartConfig);
	

});	
	
