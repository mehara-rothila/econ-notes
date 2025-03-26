import React from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label, ResponsiveContainer } from 'recharts';
import styled from 'styled-components'; // Import styled-components if you want fine-grained SVG styling

// --- Styled Components (Optional: For fine control over SVG text/elements) ---
const StyledLabel = styled(Label)`
  font-size: 12px;
  fill: ${props => props.fill || '#333'};
`;

// Unused styled component - commenting out
// const StyledAxisLabel = styled(Label)`
//   font-size: 14px;
//   fill: #555;
// `;

// --- Graph Data & Pre-calculated Values ---

// Q1 Values
const P_star_q1 = 105;
const Q_star_q1 = 600;
const P_diseq_q1 = 75;
const Qd_diseq_q1 = 1200;
const Qs_diseq_q1 = 0;
const shortage_q1 = 1200;
const P_star_q1_v = 107.5;
const Q_star_q1_v = 750;

// Q1 Graph Data (Simplified - define points to show curve shapes)
// Unused variable - commenting out
// const graphData_q1_iv = [
//     { Q: 0, P_demand: 135, P_supply: 75 },
//     { Q: Qs_diseq_q1, P_supply_point: P_diseq_q1 }, // Point for Qs=0 at P=75
//     { Q: Q_star_q1, P_demand: P_star_q1, P_supply: P_star_q1 },
//     { Q: Qd_diseq_q1, P_demand_point: P_diseq_q1 }, // Point for Qd=1200 at P=75
//     { Q: 1350, P_demand: 0, P_supply: 142.5 }, // Demand intercept Q=1350 when P=0 is wrong (Qd=0 when P=135)
//     // Correct intercepts: Qd=0 at P=135; Qs=0 at P=75
// ];

// Q1(v) Graph Data
// Unused variable - commenting out
// const graphData_q1_v = [
//      // Define points covering original and new lines/equilibria
//      { Q: 0, P_d0: 135, P_s0: 75, P_d1: 145, P_s1: 70},
//      { Q: Q_star_q1, P_d0: P_star_q1, P_s0: P_star_q1, P_d1: 115, P_s1: 85},
//      { Q: Q_star_q1_v, P_d0: 97.5, P_s0: 112.5, P_d1: P_star_q1_v, P_s1: P_star_q1_v},
//      { Q: 1000, P_d0: 85, P_s0: 125, P_d1: 95, P_s1: 120 },
// ];

// Q2 Values
const P_star_q2 = 42;
const Q_star_q2 = 16;

// Q3 Values
const P_star_q3 = Math.sqrt(150).toFixed(2); // approx 12.25
const Q_star_q3 = 350;
const P_diseq_q3 = 15;
const Qd_diseq_q3 = 125;
const Qs_diseq_q3 = 425;
const surplus_q3 = 300;
const P_star_q3_iii = Math.sqrt(125).toFixed(2); // approx 11.18
const Q_star_q3_iii = 325;

// Q4 Values
const P_star_q4 = 60;
const Q_star_q4 = 380;
const P_star_q4_ii = 80;
const Q_star_q4_ii = 440;
// Q4 Graph Data
// Unused variable - commenting out
// const graphData_q4_iii = [
//     { Q: 0, P_d0: 250, P_s0: -66.7, P_d1: 300 }, // P-intercepts
//     { Q: Q_star_q4, P_eq0: P_star_q4 }, // Old Eq
//     { Q: Q_star_q4_ii, P_eq1: P_star_q4_ii }, // New Eq
//     { Q: 500, P_d0: 0, P_s0: 100, P_d1: 50 }, // Q-intercepts D0=500, D1=600; S=200 at P=0
// ];

// Q5 Values
const P_star_q5 = (500/6).toFixed(2); // approx 83.33
const Q_star_q5 = (466.67).toFixed(2); // approx 466.67
const P_star_q5_ii = 100;
const Q_star_q5_ii = 550;
const P_diseq_q5 = 120;
const Qd_diseq_q5_v = 470;
const Qs_diseq_q5_v = 590;
const surplus_q5_v = 120;
// Q5 Graph Data
// Unused variable - commenting out
// const graphData_q5_iii = [
//     { Q: 0, P_d0: 200, P_s0: -150, P_d1: 237.5, P_s1: -175 }, // P-intercepts
//     { Q: parseFloat(Q_star_q5), P_eq0: parseFloat(P_star_q5) }, // Old Eq
//     { Q: Q_star_q5_ii, P_eq1: P_star_q5_ii }, // New Eq
//     { Q: 800, P_d0: 0, P_s0: 250, P_d1: 37.5, P_s1: 225 }, // Q-intercepts D0=800, D1=950; S0=300, S1=350 at P=0
// ];


function TutorialSolutions() {
    // Helper function to generate line data based on linear equations
    // P = intercept + slope * Q
    const generateLineData = (pIntercept, qIntercept, qMax, points = 20) => {
        if (qIntercept === 0) return []; // Avoid division by zero if vertical
        const slope = (pIntercept - 0) / (0 - qIntercept); // P = pIntercept + slope*Q
        const data = [];
        for (let i = 0; i <= points; i++) {
            const Q = (qMax / points) * i;
            const P = pIntercept + slope * Q;
            // Only include points within a reasonable Price range (e.g., non-negative)
            if (P >= 0) {
                 data.push({ Q, P });
            } else if (data.length > 0 || i === 0) {
                // Include the point where it crosses P=0 if not already added
                const Q_at_P0 = -pIntercept / slope;
                if (Q_at_P0 >= 0 && Q_at_P0 <= qMax && !data.find(p=> p.Q === Q_at_P0)) {
                     data.push({ Q: Q_at_P0, P: 0 });
                }
            }
        }
         // Ensure intercepts are included if within range
        if (!data.find(p => p.Q === 0) && pIntercept >= 0) data.unshift({ Q: 0, P: pIntercept });
         const Q_at_P0 = -pIntercept / slope;
         if (!data.find(p => p.Q === Q_at_P0) && Q_at_P0 >=0 && Q_at_P0 <= qMax) data.push({Q: Q_at_P0, P:0});
         // Sort by Q for correct line drawing
         data.sort((a, b) => a.Q - b.Q);
        return data;
    };

    // --- Generate Graph Data Programmatically ---
    // Q1 Data Generation
    const q1_D_Data = generateLineData(135, 2700, 1400); // P = 135 - 0.05Q
    const q1_S_Data = generateLineData(75, -1500, 1400).filter(p => p.Q >= 0); // P = 75 + 0.05Q (Qs=0 at P=75)
    const q1_D1_Data = generateLineData(145, 2900, 1400); // P = 145 - 0.05Q
    const q1_S1_Data = generateLineData(70, -1400, 1400).filter(p => p.Q >= 0); // P = 70 + 0.05Q (Qs=0 at P=70)

     // Q4 Data Generation
     const q4_D0_Data = generateLineData(250, 500, 600); // P = 250 - 0.5Q
     const q4_S_Data = generateLineData(-200/3, -200, 600).filter(p => p.Q >= 0); // P = (Q-200)/3
     const q4_D1_Data = generateLineData(300, 600, 600); // P = 300 - 0.5Q

     // Q5 Data Generation
     const q5_D0_Data = generateLineData(200, 800, 900); // P = 200 - 0.25Q
     const q5_S0_Data = generateLineData(-150, -300, 900).filter(p => p.Q >= 0); // P = (Q-300)/2
     const q5_D1_Data = generateLineData(237.5, 950, 900); // P = 237.5 - 0.25Q
     const q5_S1_Data = generateLineData(-175, -350, 900).filter(p => p.Q >= 0); // P = (Q-350)/2


    return (
        <div>
            <h1>Tutorial 03: Problems & Solutions</h1>
            <p className="tutorial-intro">Applying Concepts of Supply, Demand, and Equilibrium</p>

            {/* Question 01 Block */}
            <div className="question-block">
                <h2>Question 01: Cybersecurity Software</h2>
                <p>Data:</p>
                <Table striped bordered hover responsive size="sm" className="schedule-table">
                     <thead><tr><th>Price (P)</th><th>Quantity Demanded (Qd)</th><th>Quantity Supplied (Qs)</th></tr></thead>
                    <tbody>
                        <tr><td>120</td><td>300</td><td>900</td></tr>
                        <tr><td>110</td><td>500</td><td>700</td></tr>
                        <tr><td>100</td><td>700</td><td>500</td></tr>
                        <tr><td>90</td><td>900</td><td>300</td></tr>
                        <tr><td>80</td><td>1100</td><td>100</td></tr>
                    </tbody>
                </Table>

                <h4>i. Determine linear demand and supply equations.</h4>
                <p>Find slope for Demand: <code className="formula">b = - (ΔQd / ΔP) = - (200 / -10) = 20</code></p>
                <p>Find intercept for Demand: <code className="formula">300 = a - 20*(120) => a = 2700</code></p>
                <p><b>Demand Equation:</b> <code className="formula">Qd = 2700 - 20P</code></p>
                <p>Find slope for Supply: <code className="formula">d = (ΔQs / ΔP) = (200 / 10) = 20</code></p>
                <p>Find intercept for Supply: <code className="formula">500 = c + 20*(100) => c = -1500</code></p>
                <p><b>Supply Equation:</b> <code className="formula">Qs = -1500 + 20P</code></p>


                <h4>ii. Find market equilibrium (P*, Q*) and interpret.</h4>
                <p>Set Qd = Qs: <code className="calculation">2700 - 20P = -1500 + 20P</code></p>
                <p><code className="calculation">4200 = 40P => P* = 105</code></p>
                <p>Substitute P*: <code className="calculation">Q* = 2700 - 20*(105) = 600</code></p>
                 <p><b>Equilibrium: P* = ${P_star_q1}, Q* = {Q_star_q1} licenses</b></p>
                <Alert variant="success" className="interpretation">
                    The market clears at a price of ${P_star_q1}, where {Q_star_q1} licenses are demanded and supplied.
                </Alert>

                <h4>iii. Disequilibrium at P = ${P_diseq_q1}.</h4>
                <p>a) Find Qd and Qs at P=${P_diseq_q1}:</p>
                <p><code className="calculation">Qd = 2700 - 20*({P_diseq_q1}) = {Qd_diseq_q1}</code></p>
                <p><code className="calculation">Qs = -1500 + 20*({P_diseq_q1}) = {Qs_diseq_q1}</code></p>
                 <p>b) Since Qd ({Qd_diseq_q1}) > Qs ({Qs_diseq_q1}), there is a <span className="emphasis">Shortage</span>.</p>
                <p>Size: <code className="calculation">Shortage = {Qd_diseq_q1} - {Qs_diseq_q1} = {shortage_q1} licenses</code></p>
                 <Alert variant="warning" className="warning">
                    At ${P_diseq_q1}, a significant shortage of {shortage_q1} licenses exists.
                </Alert>


                <h4>iv. Graphical Representation.</h4>
                 <div className="graph-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart margin={{ top: 20, right: 40, left: 10, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Q" type="number" name="Quantity"
                                label={{ value: 'Quantity', position: 'insideBottom', offset: -25 }}
                                domain={[0, 1400]} ticks={[0, 200, Q_star_q1, 1000, Qd_diseq_q1, 1400]} />
                            <YAxis type="number" name="Price"
                                label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                                domain={[60, 150]} ticks={[P_diseq_q1, P_star_q1, 135, 150]}/>
                           <Tooltip />
                            <Legend verticalAlign="top" />

                            <Line type="monotone" dataKey="P" data={q1_D_Data} stroke="#2980b9" strokeWidth={2} name="Demand (D)" dot={false}/>
                            <Line type="monotone" dataKey="P" data={q1_S_Data} stroke="#d35400" strokeWidth={2} name="Supply (S)" dot={false}/>

                             {/* Equilibrium Point */}
                            <ReferenceLine y={P_star_q1} stroke="grey" strokeDasharray="3 3" />
                            <ReferenceLine x={Q_star_q1} stroke="grey" strokeDasharray="3 3" />
                             <circle cx={Q_star_q1} cy={P_star_q1} r={5} fill="#a70e0e" /> {/* Manual positioning needed */}
                              <StyledLabel value={`E (${Q_star_q1}, ${P_star_q1})`} position="right" x={Q_star_q1} y={P_star_q1-10} fill="#a70e0e"/>


                             {/* Disequilibrium Line at P=75 */}
                             <ReferenceLine y={P_diseq_q1} stroke="red" strokeDasharray="4 4" label={{ value: `P=${P_diseq_q1}`, position: 'left', fill:'red' }} />
                             {/* Points at P=75 */}
                             <circle cx={Qs_diseq_q1} cy={P_diseq_q1} r={4} fill="#d35400" /> {/* Supply point */}
                             <circle cx={Qd_diseq_q1} cy={P_diseq_q1} r={4} fill="#2980b9" /> {/* Demand point */}
                             <ReferenceLine x={Qs_diseq_q1} stroke="red" strokeDasharray="4 4" />
                             <StyledLabel value={`Qs=${Qs_diseq_q1}`} position="bottom" x={Qs_diseq_q1+10} y={P_diseq_q1+15}/>
                             <ReferenceLine x={Qd_diseq_q1} stroke="red" strokeDasharray="4 4" />
                             <StyledLabel value={`Qd=${Qd_diseq_q1}`} position="bottom" x={Qd_diseq_q1-50} y={P_diseq_q1+15}/>

                              {/* Draw Shortage indication */}
                             <path d={`M ${Qs_diseq_q1},${P_diseq_q1} L ${Qd_diseq_q1},${P_diseq_q1}`} stroke="red" strokeWidth="2" />
                             <StyledLabel value={`Shortage = ${shortage_q1}`} position="bottom" fill="red" x={(Qs_diseq_q1 + Qd_diseq_q1)/2} y={P_diseq_q1 + 5}/>

                        </LineChart>
                    </ResponsiveContainer>
                    <p>Graph showing Demand (D), Supply (S), Equilibrium (E), and Shortage at P=$75.</p>
                </div>


                <h4>v. Impact of shifts: Demand increases by 200, Supply increases by 100.</h4>
                <p>New Demand: <code className="formula">Qd' = 2900 - 20P</code></p>
                <p>New Supply: <code className="formula">Qs' = -1400 + 20P</code></p>
                <p>Set Qd' = Qs': <code className="calculation">2900 - 20P = -1400 + 20P => 4300 = 40P => P** = 107.5</code></p>
                <p>Substitute P**: <code className="calculation">Q** = 2900 - 20*(107.5) = 750</code></p>
                <p><b>New Equilibrium: P** = ${P_star_q1_v}, Q** = {Q_star_q1_v} licenses</b></p>
                <Alert variant="info" className="interpretation">
                    Both curves shifted right. Since the demand shift (+200) > supply shift (+100), the equilibrium price increased (to ${P_star_q1_v}) and quantity increased (to {Q_star_q1_v}).
                </Alert>
                <div className="graph-container">
                     <ResponsiveContainer width="100%" height={400}>
                        <LineChart margin={{ top: 20, right: 40, left: 10, bottom: 40 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="Q" type="number" name="Quantity"
                                label={{ value: 'Quantity', position: 'insideBottom', offset: -25 }}
                                domain={[0, 1200]} ticks={[0, 200, Q_star_q1, Q_star_q1_v, 1000, 1200]} />
                             <YAxis type="number" name="Price"
                                label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                                domain={[60, 150]} ticks={[70, P_star_q1, P_star_q1_v, 135, 145]}/>
                             <Tooltip />
                             <Legend verticalAlign="top" />

                             {/* Original Lines (Faded) */}
                              <Line type="monotone" dataKey="P" data={q1_D_Data} stroke="#a9cce3" strokeWidth={1.5} name="D0" dot={false}/>
                              <Line type="monotone" dataKey="P" data={q1_S_Data} stroke="#f5cba7" strokeWidth={1.5} name="S0" dot={false}/>

                              {/* New Lines */}
                               <Line type="monotone" dataKey="P" data={q1_D1_Data} stroke="#2980b9" strokeWidth={2.5} name="D1" dot={false}/>
                              <Line type="monotone" dataKey="P" data={q1_S1_Data} stroke="#d35400" strokeWidth={2.5} name="S1" dot={false}/>

                               {/* Equilibria */}
                               <ReferenceLine x={Q_star_q1} stroke="grey" strokeDasharray="2 2" />
                               <ReferenceLine y={P_star_q1} stroke="grey" strokeDasharray="2 2" />
                                <circle cx={Q_star_q1} cy={P_star_q1} r={4} fill="grey" />
                                <StyledLabel value={`E0`} position="right" fill="grey" x={Q_star_q1} y={P_star_q1-10} />

                               <ReferenceLine x={Q_star_q1_v} stroke="green" strokeDasharray="3 3" />
                               <ReferenceLine y={P_star_q1_v} stroke="green" strokeDasharray="3 3" />
                                <circle cx={Q_star_q1_v} cy={P_star_q1_v} r={5} fill="#27ae60" />
                                <StyledLabel value={`E1`} position="right" fill="green" x={Q_star_q1_v} y={P_star_q1_v-10} />

                        </LineChart>
                     </ResponsiveContainer>
                     <p>Graph showing original (E0) and new (E1) equilibria after shifts.</p>
                </div>
            </div>

             {/* Question 02 Block */}
             <div className="question-block">
                <h2>Question 02: CloudSafe Storage</h2>
                 <p>Equations: I. <code className="formula">100 = Qd + 2P</code>; II. <code className="formula">P = Qs/0.5 + 10</code></p>
                <h4>Find market equilibrium.</h4>
                <p>Rewrite equations:</p>
                <p>Demand: <code className="calculation">Qd = 100 - 2P</code></p>
                <p>Supply: <code className="calculation">P = 2Qs + 10 => 2Qs = P - 10 => Qs = 0.5P - 5</code></p>
                <p>Set Qd = Qs: <code className="calculation">100 - 2P = 0.5P - 5</code></p>
                <p><code className="calculation">105 = 2.5P => P* = 42</code></p>
                <p>Substitute P*: <code className="calculation">Q* = 100 - 2*(42) = 16</code></p>
                 <p><b>Equilibrium: P* = ${P_star_q2}, Q* = {Q_star_q2} subscriptions</b></p>
                <Alert variant="success" className="interpretation">
                    Equilibrium occurs at a price of ${P_star_q2} with {Q_star_q2} subscriptions exchanged.
                </Alert>
             </div>

             {/* Question 03 Block */}
            <div className="question-block">
                <h2>Question 03: AI Learning Platform (Non-Linear)</h2>
                <p>Equations: Demand: <code className="formula">Qd = 800 - 3P²</code>; Supply: <code className="formula">Qs = 200 + P²</code></p>

                <h4>i. Find equilibrium price (P*) and quantity (Q*).</h4>
                 <p>Set Qd = Qs: <code className="calculation">800 - 3P² = 200 + P²</code></p>
                 <p><code className="calculation">600 = 4P² => P² = 150 => P* = √150 ≈ {P_star_q3}</code></p>
                 <p>Substitute P²: <code className="calculation">Q* = 200 + 150 = {Q_star_q3}</code></p>
                 <p><b>Equilibrium: P* ≈ ${P_star_q3}, Q* = {Q_star_q3} subscriptions</b></p>
                 <Alert variant="success" className="interpretation">Equilibrium is at P≈${P_star_q3}, Q={Q_star_q3}.</Alert>

                <h4>ii. Shortage or surplus at P = ${P_diseq_q3}?</h4>
                 <p>Find Qd and Qs at P=${P_diseq_q3}:</p>
                 <p><code className="calculation">Qd = 800 - 3*({P_diseq_q3}²) = 800 - 675 = {Qd_diseq_q3}</code></p>
                 <p><code className="calculation">Qs = 200 + ({P_diseq_q3}²) = 200 + 225 = {Qs_diseq_q3}</code></p>
                 <p>Since Qs ({Qs_diseq_q3}) > Qd ({Qd_diseq_q3}), there is a <span className="emphasis-neg">Surplus</span>.</p>
                 <p>Size: <code className="calculation">Surplus = {Qs_diseq_q3} - {Qd_diseq_q3} = {surplus_q3} subscriptions</code></p>
                 <Alert variant="warning" className="warning">At ${P_diseq_q3}, a surplus of {surplus_q3} exists.</Alert>

                <h4>iii. Impact of decreased demand: Qd' = 700 - 3P². Find new equilibrium.</h4>
                <p>New Demand: <code className="formula">Qd' = 700 - 3P²</code>; Supply: <code className="formula">Qs = 200 + P²</code></p>
                <p>Set Qd' = Qs: <code className="calculation">700 - 3P² = 200 + P²</code></p>
                <p><code className="calculation">500 = 4P² => P² = 125 => P** = √125 ≈ {P_star_q3_iii}</code></p>
                <p>Substitute P²: <code className="calculation">Q** = 200 + 125 = {Q_star_q3_iii}</code></p>
                <p><b>New Equilibrium: P** ≈ ${P_star_q3_iii}, Q** = {Q_star_q3_iii} subscriptions</b></p>
                <Alert variant="info" className="interpretation">
                    The decrease in demand led to a lower equilibrium price (≈${P_star_q3_iii}) and a lower equilibrium quantity ({Q_star_q3_iii}).
                </Alert>
            </div>

             {/* Question 04 Block */}
             <div className="question-block">
                <h2>Question 04: Cloud Computing Market</h2>
                 <p>Initial: Demand: <code className="formula">Qd = 500 - 2P</code>; Supply: <code className="formula">Qs = 200 + 3P</code></p>

                <h4>i. Find initial equilibrium (P*, Q*).</h4>
                <p>Set Qd = Qs: <code className="calculation">500 - 2P = 200 + 3P => 300 = 5P => P* = {P_star_q4}</code></p>
                <p>Substitute P*: <code className="calculation">Q* = 500 - 2*({P_star_q4}) = {Q_star_q4}</code></p>
                <p><b>Initial Equilibrium: P* = ${P_star_q4}, Q* = {Q_star_q4} million TB</b></p>

                <h4>ii. Find new equilibrium after demand increases by 100 million TB.</h4>
                <p>New Demand: <code className="formula">Qd' = (500 - 2P) + 100 = 600 - 2P</code></p>
                <p>Set Qd' = Qs: <code className="calculation">600 - 2P = 200 + 3P => 400 = 5P => P** = {P_star_q4_ii}</code></p>
                <p>Substitute P**: <code className="calculation">Q** = 600 - 2*({P_star_q4_ii}) = {Q_star_q4_ii}</code></p>
                <p><b>New Equilibrium: P** = ${P_star_q4_ii}, Q** = {Q_star_q4_ii} million TB</b></p>
                <Alert variant="info" className="interpretation">Increased demand led to higher P* and Q*.</Alert>

                <h4>iii. Illustrate both equilibria on the same graph.</h4>
                <div className="graph-container">
                    <ResponsiveContainer width="100%" height={400}>
                       <LineChart margin={{ top: 20, right: 40, left: 10, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Q" type="number" name="Quantity"
                               label={{ value: 'Quantity (Millions TB)', position: 'insideBottom', offset: -25 }}
                               domain={[0, 600]} ticks={[0, 200, Q_star_q4, Q_star_q4_ii, 600]} />
                            <YAxis type="number" name="Price"
                               label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                               domain={[0, 310]} ticks={[0, P_star_q4, P_star_q4_ii, 250, 300]}/>
                            <Tooltip />
                            <Legend verticalAlign="top" />

                           {/* Lines */}
                           <Line type="linear" dataKey="P" data={q4_D0_Data} stroke="#a9cce3" strokeWidth={1.5} name="D0" dot={false}/>
                           <Line type="linear" dataKey="P" data={q4_S_Data} stroke="#d35400" strokeWidth={2} name="S" dot={false}/>
                           <Line type="linear" dataKey="P" data={q4_D1_Data} stroke="#2980b9" strokeWidth={2.5} name="D1" dot={false}/>

                           {/* Equilibria */}
                           <ReferenceLine x={Q_star_q4} stroke="grey" strokeDasharray="2 2" />
                           <ReferenceLine y={P_star_q4} stroke="grey" strokeDasharray="2 2" />
                           <circle cx={Q_star_q4} cy={P_star_q4} r={4} fill="grey" />
                            <StyledLabel value={`E0`} position="right" fill="grey" x={Q_star_q4} y={P_star_q4-10} />

                           <ReferenceLine x={Q_star_q4_ii} stroke="green" strokeDasharray="3 3" />
                           <ReferenceLine y={P_star_q4_ii} stroke="green" strokeDasharray="3 3" />
                            <circle cx={Q_star_q4_ii} cy={P_star_q4_ii} r={5} fill="#27ae60" />
                            <StyledLabel value={`E1`} position="right" fill="green" x={Q_star_q4_ii} y={P_star_q4_ii-10} />

                      </LineChart>
                   </ResponsiveContainer>
                    <p>Graph showing initial (E0) and new (E1) equilibria for cloud market.</p>
               </div>
            </div>

            {/* Question 05 Block */}
           <div className="question-block">
               <h2>Question 05: 5G Smartphone Market</h2>
               <p>Initial: Demand: <code className="formula">Qd = 800 - 4P</code>; Supply: <code className="formula">Qs = 300 + 2P</code></p>

               <h4>i. Find initial equilibrium (P*, Q*).</h4>
               <p>Set Qd = Qs: <code className="calculation">800 - 4P = 300 + 2P => 500 = 6P => P* = 500/6 ≈ {P_star_q5}</code></p>
               <p>Substitute P*: <code className="calculation">Q* = 300 + 2*(500/6) ≈ {Q_star_q5}</code></p>
               <p><b>Initial Equilibrium: P* ≈ ${P_star_q5}, Q* ≈ {Q_star_q5} million phones</b></p>

               <h4>ii. Find new equilibrium after demand increases by 150m, supply increases by 50m.</h4>
               <p>New Demand: <code className="formula">Qd' = (800 - 4P) + 150 = 950 - 4P</code></p>
               <p>New Supply: <code className="formula">Qs' = (300 + 2P) + 50 = 350 + 2P</code></p>
               <p>Set Qd' = Qs': <code className="calculation">950 - 4P = 350 + 2P => 600 = 6P => P** = {P_star_q5_ii}</code></p>
               <p>Substitute P**: <code className="calculation">Q** = 350 + 2*({P_star_q5_ii}) = {Q_star_q5_ii}</code></p>
               <p><b>New Equilibrium: P** = ${P_star_q5_ii}, Q** = {Q_star_q5_ii} million phones</b></p>
                <Alert variant="info" className="interpretation">Simultaneous increases led to P**=${P_star_q5_ii} and Q**={Q_star_q5_ii} million.</Alert>

               <h4>iii. Graphically show old and new equilibria.</h4>
               <div className="graph-container">
                   <ResponsiveContainer width="100%" height={400}>
                        <LineChart margin={{ top: 20, right: 40, left: 10, bottom: 40 }}>
                           <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Q" type="number" name="Quantity"
                               label={{ value: 'Quantity (Millions)', position: 'insideBottom', offset: -25 }}
                               domain={[0, 900]} ticks={[0, 200, 400, Math.round(Q_star_q5), Q_star_q5_ii, 800]} />
                            <YAxis type="number" name="Price"
                               label={{ value: 'Price ($)', angle: -90, position: 'insideLeft', offset: -5 }}
                               domain={[0, 250]} ticks={[0, 50, Math.round(P_star_q5), P_star_q5_ii, 200, 237.5]}/>
                            <Tooltip />
                            <Legend verticalAlign="top" />

                            {/* Lines */}
                            <Line type="linear" dataKey="P" data={q5_D0_Data} stroke="#a9cce3" strokeWidth={1.5} name="D0" dot={false}/>
                            <Line type="linear" dataKey="P" data={q5_S0_Data} stroke="#f5cba7" strokeWidth={1.5} name="S0" dot={false}/>
                            <Line type="linear" dataKey="P" data={q5_D1_Data} stroke="#2980b9" strokeWidth={2.5} name="D1" dot={false}/>
                            <Line type="linear" dataKey="P" data={q5_S1_Data} stroke="#d35400" strokeWidth={2.5} name="S1" dot={false}/>

                           {/* Equilibria */}
                           <ReferenceLine x={parseFloat(Q_star_q5)} stroke="grey" strokeDasharray="2 2" />
                           <ReferenceLine y={parseFloat(P_star_q5)} stroke="grey" strokeDasharray="2 2" />
                           <circle cx={parseFloat(Q_star_q5)} cy={parseFloat(P_star_q5)} r={4} fill="grey" />
                           <StyledLabel value={`E0`} position="right" fill="grey" x={parseFloat(Q_star_q5)} y={parseFloat(P_star_q5)-10} />

                           <ReferenceLine x={Q_star_q5_ii} stroke="green" strokeDasharray="3 3" />
                           <ReferenceLine y={P_star_q5_ii} stroke="green" strokeDasharray="3 3" />
                            <circle cx={Q_star_q5_ii} cy={P_star_q5_ii} r={5} fill="#27ae60" />
                            <StyledLabel value={`E1`} position="right" fill="green" x={Q_star_q5_ii} y={P_star_q5_ii-10} />

                      </LineChart>
                   </ResponsiveContainer>
                   <p>Graph showing original (E0) and new (E1) 5G phone market equilibria.</p>
               </div>

               <h4>iv. According to the case study, how do increased users and production affect equilibrium?</h4>
                <Alert variant="info" className="interpretation">
                    Increased users shift demand right (raising P and Q). Increased production shifts supply right (lowering P, raising Q). The net effect is a definite increase in Q. The price change depends on the relative shift magnitudes; here, the demand effect on price was stronger, leading to a net price increase (from ≈${P_star_q5} to ${P_star_q5_ii}).
               </Alert>

               <h4>v. Shortage or surplus if P = ${P_diseq_q5} (using new functions)?</h4>
                <p>Use New Functions: Qd' = 950 - 4P; Qs' = 350 + 2P</p>
                <p>Find Qd' and Qs' at P=${P_diseq_q5}:</p>
                <p><code className="calculation">Qd' = 950 - 4*({P_diseq_q5}) = {Qd_diseq_q5_v}</code></p>
                <p><code className="calculation">Qs' = 350 + 2*({P_diseq_q5}) = {Qs_diseq_q5_v}</code></p>
                <p>Since Qs' ({Qs_diseq_q5_v}) > Qd' ({Qd_diseq_q5_v}), there is a <span className="emphasis-neg">Surplus</span>.</p>
                <p>Size: <code className="calculation">Surplus = {Qs_diseq_q5_v} - {Qd_diseq_q5_v} = {surplus_q5_v} million phones</code></p>
                 <Alert variant="warning" className="warning">At ${P_diseq_q5} (above the new equilibrium P**=${P_star_q5_ii}), there's a surplus of {surplus_q5_v} million phones.</Alert>
           </div>

           <p className="tutorial-end">- END OF TUTORIAL 03 SOLUTIONS -</p>
       </div>
   );
}

export default TutorialSolutions;