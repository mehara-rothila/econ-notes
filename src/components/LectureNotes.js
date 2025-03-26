import React from 'react';
// Import Recharts components needed for graphs
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ReferenceLine, Label, ReferenceDot, ResponsiveContainer
} from 'recharts';
// Import Bootstrap Table component
import Table from 'react-bootstrap/Table';

// --- Example Data & Calculations for Graphs ---
// Based on Example 1: Qd=500-5P, Qs=100+3P => Equilibrium P*=50, Q*=250
const P_equilibrium = 50;
const Q_equilibrium = 250;

// Example prices for showing disequilibrium
const P_high = 70; // Price above equilibrium -> Surplus
const P_low = 30; // Price below equilibrium -> Shortage

// Calculate corresponding quantities at these disequilibrium prices
const Qd_at_P_high = 500 - 5 * P_high; // 150
const Qs_at_P_high = 100 + 3 * P_high; // 310
const Surplus_Amount = Qs_at_P_high - Qd_at_P_high; // 160

const Qd_at_P_low = 500 - 5 * P_low; // 350
const Qs_at_P_low = 100 + 3 * P_low; // 190
const Shortage_Amount = Qd_at_P_low - Qs_at_P_low; // 160

// Helper Function to generate points for drawing linear P=f(Q) lines
const generateEqLineData = (pIntercept, qIntercept, qMax, points = 20) => {
    const minP = -Math.abs(pIntercept / 3); // Allow slightly negative P for viz
    const maxP = Math.max(120, pIntercept + 20); // Upper limit for plot
    if (qIntercept === 0) return [];
    const slope = (pIntercept - 0) / (0 - qIntercept);
    if (slope === 0) return [{ Q: 0, P: pIntercept }, { Q: qMax, P: pIntercept }];
    if (Math.abs(slope) === Infinity) return [{ Q: qIntercept, P: 0 }, { Q: qIntercept, P: maxP }];

    const data = [];
    const maxQ = qMax + 50; // Allow Q slightly beyond axis max

    for (let i = 0; i <= points; i++) {
        const Q = Math.round((qMax / points) * i);
        const P = pIntercept + slope * Q;
        if (Q <= maxQ && P >= minP && P <= maxP) { data.push({ Q, P }); }
    }
    if (pIntercept >= 0 && pIntercept <= maxP && !data.find(p => p.Q === 0)) { data.unshift({ Q: 0, P: pIntercept }); }
    const Q_at_P0_final = -pIntercept / slope;
    if (!isNaN(Q_at_P0_final) && Q_at_P0_final >=0 && Q_at_P0_final <= qMax && !data.find(p => Math.abs(p.Q - Q_at_P0_final) < 0.1 )) { data.push({ Q: Math.round(Q_at_P0_final), P: 0 }); }
    if (Q_equilibrium <= qMax && !data.find(p => p.Q === Q_equilibrium)) {
        const P_at_eq = pIntercept + slope * Q_equilibrium;
        if ( P_at_eq >= minP && P_at_eq <= maxP ){ data.push({ Q: Q_equilibrium, P: P_at_eq}); }
    }
    data.sort((a, b) => a.Q - b.Q);
    return data; // Can filter p.P >= 0 later if needed
};

// Demand: P = 100 - 0.2Q (from Qd=500-5P)
const eqDemandData = generateEqLineData(100, 500, 550);
// Supply: P = (Q - 100) / 3 => P = -100/3 + Q/3 (from Qs=100+3P)
// Filter ensures only positive P values (or Q >= 100) are plotted for supply
const eqSupplyData = generateEqLineData(-100/3, 100, 550).filter(p => p.P >= 0);


// --- React Component ---
function LectureNotes() {
    return (
        <div>
            {/* Slide 1 & 2: Title */}
            <small>IS 2230: Economic Applications in Business</small>
            <h1>Lecture 3: Demand and Supply Together</h1>
            <p style={{ textAlign: 'center', fontSize: '1.1em', fontStyle: 'italic', color: '#555' }}>
                Understanding how market forces interact to determine prices and quantities, like balancing demand and supply on a scale.
            </p>

            {/* Slide 3: Learning Outcomes */}
            <h2>Learning Outcomes</h2>
            <p>By the end of this session, you should be able to:</p>
            <ul>
                <li>Explain what market equilibrium is.</li>
                <li>Explain what market disequilibrium (shortages and surpluses) is.</li>
                <li>Find the market equilibrium point (price and quantity).</li>
                <li>Analyze how changes (shifts) in demand or supply affect market equilibrium.</li>
                <li>Explain how prices function to allocate resources in an economy.</li>
            </ul>

            {/* Slide 4: Demand and Supply Together */}
            <h2>Combining Demand and Supply</h2>
             <p>
                Having analyzed supply and demand separately, we now combine them. Their interaction in a competitive market determines:
            </p>
            <ul>
                <li>The final <span className="key-term">price</span>.</li>
                <li>The final <span className="key-term">quantity</span> bought and sold.</li>
            </ul>
            <p>Key ideas:</p>
            <ul>
                <li>Markets function through the interaction of demand and supply.</li>
                <li><span className="important">Neither demand nor supply alone</span> determines the outcome; they must be considered together.</li>
                <li>Prices act as <span className="concept">signals</span>, adjusting based on consumer demand and producer supply.</li>
                <li>This interaction naturally moves the market toward a <span className="concept">balance</span>, known as equilibrium.</li>
            </ul>

            {/* Slide 5: Market Equilibrium - Key Concepts */}
            <h2>Market Equilibrium – The Balancing Point</h2>
            <p>
                <span className="concept">Market Equilibrium</span> is the point where the quantity buyers demand (<span className="key-term">Qd</span>) exactly equals the quantity sellers supply (<span className="key-term">Qs</span>).
            </p>
            <ul>
                <li>It's the point where the demand and supply curves intersect.</li>
                <li>At this point, the market "clears" – everyone willing to buy at that price finds a seller, and vice-versa.</li>
                <li>There's no inherent pressure for the price to change, meaning no persistent <span className="emphasis-neg">shortage</span> or <span className="emphasis-neg">surplus</span>.</li>
            </ul>
            <div className="definition">
                <p><span className="concept">Equilibrium Price (P*):</span> The price where Qd = Qs.</p>
                <p><span className="concept">Equilibrium Quantity (Q*):</span> The quantity exchanged at P*.</p>
            </div>

            {/* Equilibrium Graph */}
            <div className="graph-container">
                <p style={{ fontWeight: 'bold' }}>Visualizing Equilibrium</p>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart margin={{ top: 20, right: 40, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Q" type="number" name="Quantity"
                            label={{ value: 'Quantity (Q)', position: 'insideBottom', offset: -25 }}
                            domain={[0, 550]} ticks={[0, 100, Q_equilibrium, 400, 500]} allowDuplicatedCategory={false} />
                        <YAxis dataKey="P" type="number" name="Price"
                            label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }}
                            domain={[0, 110]} ticks={[0, P_equilibrium, 100]}/>
                        <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}/>
                        <Legend verticalAlign="top" height={36}/>
                        <Line type="linear" dataKey="P" data={eqDemandData}
                            stroke="#2980b9" strokeWidth={2.5} name="Demand (D)" dot={false}/>
                        <Line type="linear" dataKey="P" data={eqSupplyData}
                            stroke="#d35400" strokeWidth={2.5} name="Supply (S)" dot={false}/>
                        {/* Annotations */}
                        <ReferenceLine x={Q_equilibrium} stroke="grey" strokeDasharray="3 3" />
                        <ReferenceLine y={P_equilibrium} stroke="grey" strokeDasharray="3 3" />
                        <Label value={`P* = ${P_equilibrium}`} position="left" offset={-15} x={50} y={P_equilibrium + 5} style={{ fill: 'grey', fontSize: '12px' }}/>
                        <Label value={`Q* = ${Q_equilibrium}`} position="bottom" offset={-10} x={Q_equilibrium} y={390} style={{ fill: 'grey', fontSize: '12px' }}/>
                        <ReferenceDot x={Q_equilibrium} y={P_equilibrium} r={6} fill="#a70e0e" stroke="none" isFront={true} />
                        <Label value="Equilibrium (E)" position="right" x={Q_equilibrium + 10} y={P_equilibrium - 10} style={{ fill: '#a70e0e', fontSize: '13px', fontWeight: 'bold' }} />
                    </LineChart>
                </ResponsiveContainer>
                 <p>Equilibrium (E) is where Demand (D) meets Supply (S) (Example: P*={P_equilibrium}, Q*={Q_equilibrium}).</p>
            </div>

            {/* Slide 6: How Equilibrium Works */}
            <h2>Market Equilibrium – How It Works</h2>
            <p>Markets naturally adjust towards equilibrium:</p>
            <ul>
                <li>If there's excess supply (<span className="emphasis-neg">Surplus</span>, Qs > Qd): Prices tend to <span className="emphasis-neg">fall</span>.</li>
                <li>If there's excess demand (<span className="emphasis">Shortage</span>, Qd > Qs): Prices tend to <span className="emphasis">rise</span>.</li>
                <li>Once equilibrium is reached, it's <span className="important">stable</span> unless external factors (tech changes, policies, preferences) shift the D or S curves.</li>
                <li>Understanding equilibrium helps explain efficient market function, optimal resource allocation, and price stability.</li>
            </ul>
            <h4>Example Explained: Cloud Storage Market</h4>
             <ul>
                 <li><span className="key-term">Demand Surge:</span> Businesses need more storage -> Demand shifts right -> Creates <span className="emphasis">shortage</span> at the old price -> Price <span className="emphasis">rises</span>.</li>
                <li><span className="key-term">Supply Response:</span> Higher prices incentivize cloud providers to expand capacity (add servers) -> Supply shifts right.</li>
                <li><span className="key-term">Equilibrium Reached:</span> Over time, increased supply and stabilized (likely higher) prices lead to a new equilibrium (P*, Q*) where Qd matches the new Qs.</li>
            </ul>

            {/* Slide 7: Finding Market Equilibrium */}
            <h2>Finding Market Equilibrium</h2>
            <p>
                While real-world supply and demand curves can be complex (curved, multiple equilibria, discontinuous), economists often use <span className="important">linear approximations</span> for:
            </p>
            <ul>
                <li>Simplicity in analysis and calculation.</li>
                <li>Generalization of concepts.</li>
                <li>Ease of interpretation.</li>
            </ul>
             <p className="interpretation">Method: Find the price where Quantity Demanded equals Quantity Supplied by setting <code className="formula">Qd = Qs</code> and solving for P*. Then, substitute this P* back into either the Qd or Qs equation to find Q*.</p>

            {/* Slides 8 & 9: Finding Equilibrium Examples (Setup) */}
            <h3>Finding Equilibrium - Examples Preview</h3>
            <p>(Equations are presented here; detailed step-by-step solutions would typically be covered in tutorials or practice sessions)</p>
              <ul>
                 <li><b>Ex 1 (Linear): Cloud Storage</b>
                     <ul>
                        <li>Demand: <code className="formula">Qd = 500 - 5P</code></li>
                        <li>Supply: <code className="formula">Qs = 100 + 3P</code></li>
                        <li>Task: Find P*, Q*, and interpret the result for the market.</li>
                     </ul>
                 </li>
                 <li><b>Ex 2 (Non-Linear): Smartphones</b>
                     <ul>
                        <li>Demand: <code className="formula">Qd = 300 – P²</code></li>
                        <li>Supply: <code className="formula">Qs = 100 + P²</code></li>
                        <li>Task: Find P* and Q*.</li>
                     </ul>
                 </li>
              </ul>

            {/* Slides 10-13: Disequilibrium */}
            <h2>Disequilibrium: When the Market is Unbalanced</h2>
             <p>
                 <span className="concept">Disequilibrium</span> occurs when the quantity supplied is <span className="important">not equal</span> to the quantity demanded (<span className="important">Qd ≠ Qs</span>) at the current market price. This results in either a shortage or a surplus.
            </p>
            {/* Disequilibrium Graph */}
            <div className="graph-container">
                 <p style={{ fontWeight: 'bold' }}>Visualizing Disequilibrium</p>
                 <ResponsiveContainer width="100%" height={400}>
                     <LineChart margin={{ top: 20, right: 40, left: 20, bottom: 40 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="Q" type="number" name="Quantity" label={{ value: 'Quantity (Q)', position: 'insideBottom', offset: -25 }} domain={[0, 550]} ticks={[0, Qd_at_P_high, Qs_at_P_low, Q_equilibrium, Qs_at_P_high, Qd_at_P_low, 500]} allowDuplicatedCategory={false}/>
                          <YAxis dataKey="P" type="number" name="Price" label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }} domain={[0, 110]} ticks={[0, P_low, P_equilibrium, P_high, 100]}/>
                        <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(0) : value}/>
                        <Legend verticalAlign="top" height={36}/>
                        <Line type="linear" dataKey="P" data={eqDemandData} stroke="#2980b9" strokeWidth={2} name="Demand (D)" dot={false}/>
                         <Line type="linear" dataKey="P" data={eqSupplyData} stroke="#d35400" strokeWidth={2} name="Supply (S)" dot={false}/>
                        {/* Equilibrium */}
                        <ReferenceLine y={P_equilibrium} stroke="grey" strokeDasharray="3 3" />
                        <ReferenceLine x={Q_equilibrium} stroke="grey" strokeDasharray="3 3"/>
                        <ReferenceDot x={Q_equilibrium} y={P_equilibrium} r={5} fill="#a70e0e" stroke="none" isFront={true}/>
                        <Label value={`E`} position="right" x={Q_equilibrium + 5} y={P_equilibrium - 15} style={{ fill: '#a70e0e', fontSize: '12px' }}/>

                        {/* Surplus Annotations at P_high */}
                        <ReferenceLine y={P_high} stroke="#c0392b" strokeDasharray="5 5" label={{ value: `Price = ${P_high}`, position: 'right', fill:'#c0392b' }} />
                        <ReferenceDot x={Qd_at_P_high} y={P_high} r={4} fill="#2980b9" isFront={true}/> {/* D point */}
                        <ReferenceDot x={Qs_at_P_high} y={P_high} r={4} fill="#d35400" isFront={true}/> {/* S point */}
                        <ReferenceLine segment={[{ x: Qd_at_P_high, y: P_high }, { x: Qs_at_P_high, y: P_high }]} stroke="#c0392b" strokeWidth={2} /> {/* Surplus Gap */}
                        <Label value={`Surplus = ${Surplus_Amount}`} position="top" fill="#c0392b" x={(Qd_at_P_high + Qs_at_P_high)/2} y={P_high - 15} style={{ fontSize: '12px', textAnchor: 'middle' }}/>
                        <ReferenceLine x={Qd_at_P_high} stroke="grey" strokeDasharray="2 2" segment={[{ x: Qd_at_P_high, y: 0 }, { x: Qd_at_P_high, y: P_high }]} />
                        <ReferenceLine x={Qs_at_P_high} stroke="grey" strokeDasharray="2 2" segment={[{ x: Qs_at_P_high, y: 0 }, { x: Qs_at_P_high, y: P_high }]} />
                         <Label value={`Qd=${Qd_at_P_high}`} position="bottom" offset={-10} x={Qd_at_P_high} y={390} style={{ fill: 'grey', fontSize: '11px' }}/>
                         <Label value={`Qs=${Qs_at_P_high}`} position="bottom" offset={-10} x={Qs_at_P_high} y={390} style={{ fill: 'grey', fontSize: '11px' }}/>


                        {/* Shortage Annotations at P_low */}
                        <ReferenceLine y={P_low} stroke="#27ae60" strokeDasharray="5 5" label={{ value: `Price = ${P_low}`, position: 'right', fill:'#27ae60' }} />
                        <ReferenceDot x={Qs_at_P_low} y={P_low} r={4} fill="#d35400" isFront={true}/> {/* S point */}
                        <ReferenceDot x={Qd_at_P_low} y={P_low} r={4} fill="#2980b9" isFront={true}/> {/* D point */}
                        <ReferenceLine segment={[{ x: Qs_at_P_low, y: P_low }, { x: Qd_at_P_low, y: P_low }]} stroke="#27ae60" strokeWidth={2} /> {/* Shortage Gap */}
                        <Label value={`Shortage = ${Shortage_Amount}`} position="bottom" fill="#27ae60" x={(Qs_at_P_low + Qd_at_P_low)/2} y={P_low + 5} style={{ fontSize: '12px', textAnchor: 'middle' }}/>
                        <ReferenceLine x={Qs_at_P_low} stroke="grey" strokeDasharray="2 2" segment={[{ x: Qs_at_P_low, y: 0 }, { x: Qs_at_P_low, y: P_low }]} />
                        <ReferenceLine x={Qd_at_P_low} stroke="grey" strokeDasharray="2 2" segment={[{ x: Qd_at_P_low, y: 0 }, { x: Qd_at_P_low, y: P_low }]} />
                        <Label value={`Qs=${Qs_at_P_low}`} position="bottom" offset={-10} x={Qs_at_P_low} y={390} style={{ fill: 'grey', fontSize: '11px' }}/>
                        <Label value={`Qd=${Qd_at_P_low}`} position="bottom" offset={-10} x={Qd_at_P_low} y={390} style={{ fill: 'grey', fontSize: '11px' }}/>
                     </LineChart>
                 </ResponsiveContainer>
                 <p>Illustration of Surplus (when Price is above P*, e.g., P={P_high}) and Shortage (when Price is below P*, e.g., P={P_low}). Economic forces work to bring the market back to equilibrium (E).</p>
            </div>

            {/* Surplus Explanation (Slide 11) */}
            <h3>Surplus (Excess Supply)</h3>
            <ul>
                <li>Occurs when the quantity supplied (Qs) is <span className="important">greater</span> than the quantity demanded (Qd) at a given price.</li>
                <li>This happens when the current price (P) is <span className="important">above</span> the equilibrium price (P*) → P > P*.</li>
                <li><b>Causes:</b> The price might be set too high (discouraging buyers), suppliers might have overproduced, or consumer demand might have decreased unexpectedly.</li>
                <li><b>Market Response:</b> To sell unsold goods, sellers are incentivized to <span className="emphasis-neg">lower prices</span>. As prices fall, Qd increases and Qs decreases, moving the market towards equilibrium (P*).</li>
            </ul>

            {/* Shortage Explanation (Slide 12) */}
            <h3>Shortage (Excess Demand)</h3>
            <ul>
                <li>Occurs when the quantity demanded (Qd) is <span className="important">greater</span> than the quantity supplied (Qs) at a given price.</li>
                <li>This happens when the current price (P) is <span className="important">below</span> the equilibrium price (P*) → P &lt; P*.</li>
                <li><b>Causes:</b> The price might be set too low (making it very attractive to buyers), production might be limited (e.g., supply chain disruptions), or demand might have suddenly increased (e.g., new trends, external factors).</li>
                <li><b>Market Response:</b> With many buyers competing for limited goods, sellers can <span className="emphasis">raise prices</span>. As prices rise, Qd decreases and Qs increases, moving the market towards equilibrium (P*).</li>
            </ul>
            <p className="interpretation">In most free markets, the activities of buyers and sellers naturally push the market price towards the equilibrium price, making surpluses and shortages temporary phenomena as prices adjust.</p>

            {/* Disequilibrium Example (Slide 14) - Reminder */}
            <h3>Example: Calculating Disequilibrium</h3>
             <p>Consider a market for wireless routers:</p>
                <ul>
                    <li>Demand: <code className="formula">Qd = 400 - 4P</code></li>
                    <li>Supply: <code className="formula">Qs = 50 + 3P</code></li>
                </ul>
             <p>If the company sets the price at <b>$70</b>:</p>
             <ol>
                 <li>Find the quantity demanded (Qd) and quantity supplied (Qs) at P=$70.</li>
                 <li>Determine if there is a shortage or a surplus at this price.</li>
                 <li>Calculate the size (magnitude) of the shortage or surplus.</li>
             </ol>
             <p>(This calculation would be performed by substituting P=70 into both equations).</p>

            {/* Changes in Equilibrium Section */}
            <h2>Changes in Equilibrium: When Curves Shift</h2>
            <p>Equilibrium (P*, Q*) is not static. It changes if a non-price factor causes the entire Demand curve or Supply curve (or both) to shift.</p>

            {/* Change in Demand (Slides 15, 16) */}
            <h3>Scenario 1: Change in Demand (Supply Constant)</h3>
            <ul>
                <li>
                    <b>Demand Increases (Shifts Right →):</b>
                    <ul>
                        <li>Causes: Increased income (normal good), changing tastes, higher price of substitutes, lower price of complements, population growth, positive expectations.</li>
                        <li>Process: At the original P*, a <span className="emphasis">shortage</span> develops (new Qd > Qs). Price <span className="emphasis">rises</span>.</li>
                        <li>Result: <span className="emphasis">New P* ↑, New Q* ↑</span>.</li>
                        <li>Example (Slide 15): Increased need for Cloud Storage due to remote work shifts Demand right. Leads to higher equilibrium price and more storage plans sold.</li>
                    </ul>
                </li>
                 <li>
                    <b>Demand Decreases (Shifts Left ←):</b>
                     <ul>
                        <li>Causes: Decreased income (normal good), changing tastes away, lower price of substitutes, higher price of complements, population decline, negative expectations.</li>
                        <li>Process: At the original P*, a <span className="emphasis-neg">surplus</span> develops (new Qd &lt; Qs). Price <span className="emphasis-neg">falls</span>.</li>                         <li>Result: <span className="emphasis-neg">New P* ↓, New Q* ↓</span>.</li>
                        <li>Example (Slide 16): New smartphone models make older ones less desirable, shifting Demand left. Leads to lower equilibrium price and fewer units sold.</li>
                     </ul>
                 </li>
            </ul>

             {/* Change in Supply (Slides 17, 18, 19) */}
             <h3>Scenario 2: Change in Supply (Demand Constant)</h3>
             <ul>
                <li>
                     <b>Supply Increases (Shifts Right →):</b>
                     <ul>
                         <li>Causes (Slide 17): Decrease in input prices, technological improvement, expectation of lower future prices, decrease in price of production substitute, increase in number of sellers.</li>
                         <li>Process: At the original P*, a <span className="emphasis-neg">surplus</span> develops (new Qs > Qd). Price <span className="emphasis-neg">falls</span>.</li>
                         <li>Result: <span className="emphasis-neg">New P* ↓, New Q* ↑</span>.</li>
                         <li>Example (Slide 18): New tech makes Cloud Computing cheaper to provide, shifting Supply right. Leads to lower equilibrium price and more customers using the service.</li>
                     </ul>
                 </li>
                 <li>
                     <b>Supply Decreases (Shifts Left ←):</b>
                     <ul>
                         <li>Causes: Increase in input prices, technological setback, expectation of higher future prices, increase in price of production substitute, decrease in number of sellers.</li>
                         <li>Process: At the original P*, a <span className="emphasis">shortage</span> develops (new Qs &lt; Qd). Price <span className="emphasis">rises</span>.</li>                         <li>Result: <span className="emphasis">New P* ↑, New Q* ↓</span>.</li>
                         <li>Example (Slide 19): Semiconductor shortage limits laptop production, shifting Supply left. Leads to higher equilibrium price and fewer laptops sold.</li>
                     </ul>
                 </li>
             </ul>


            {/* Complex Changes (Slides 20-24) */}
            <h3>Scenario 3: Complex Changes (Both Curves Shift Simultaneously)</h3>
            <p>When both Demand and Supply shift, the impact on one variable (P* or Q*) is certain, while the impact on the other is <span className="key-term">indeterminate</span> without knowing the relative magnitudes of the shifts.</p>
            <ol>
                 <li><b>Demand ↑ AND Supply ↑:</b>
                    <ul><li>Q* definitely <span className="emphasis">↑</span> (both shifts push Q up).</li><li>P* is <span className="key-term">Indeterminate (?)</span> (D↑ pushes P↑, S↑ pushes P↓). Depends which shift is larger.</li></ul>
                 </li>
                 <li><b>Demand ↑ AND Supply ↓:</b>
                    <ul><li>P* definitely <span className="emphasis">↑</span> (both shifts push P up).</li><li>Q* is <span className="key-term">Indeterminate (?)</span> (D↑ pushes Q↑, S↓ pushes Q↓). Depends which shift is larger.</li></ul>
                 </li>
                 <li><b>Demand ↓ AND Supply ↑:</b>
                    <ul><li>P* definitely <span className="emphasis-neg">↓</span> (both shifts push P down).</li><li>Q* is <span className="key-term">Indeterminate (?)</span> (D↓ pushes Q↓, S↑ pushes Q↑). Depends which shift is larger.</li></ul>
                 </li>
                 <li><b>Demand ↓ AND Supply ↓:</b>
                    <ul><li>Q* definitely <span className="emphasis-neg">↓</span> (both shifts push Q down).</li><li>P* is <span className="key-term">Indeterminate (?)</span> (D↓ pushes P↓, S↓ pushes P↑). Depends which shift is larger.</li></ul>
                 </li>
             </ol>
              <p className="interpretation">"Indeterminate" means the final outcome for that variable could be an increase, a decrease, or no change, depending on the size of the shifts.</p>


            {/* Summary Table (Slide 25) */}
            <h2>Summary of Changes in Equilibrium</h2>
            <Table striped bordered hover responsive size="sm" className="summary-table">
                 <thead>
                     <tr><th>Change Scenario</th><th>Effect on Equilibrium Price (P*)</th><th>Effect on Equilibrium Quantity (Q*)</th></tr>
                </thead>
                 <tbody>
                    <tr><td>Supply ↑ (Right Shift)</td><td><span className="emphasis-neg">↓ (Decrease)</span></td><td><span className="emphasis">↑ (Increase)</span></td></tr>
                    <tr><td>Supply ↓ (Left Shift)</td><td><span className="emphasis">↑ (Increase)</span></td><td><span className="emphasis-neg">↓ (Decrease)</span></td></tr>
                    <tr><td>Demand ↑ (Right Shift)</td><td><span className="emphasis">↑ (Increase)</span></td><td><span className="emphasis">↑ (Increase)</span></td></tr>
                    <tr><td>Demand ↓ (Left Shift)</td><td><span className="emphasis-neg">↓ (Decrease)</span></td><td><span className="emphasis-neg">↓ (Decrease)</span></td></tr>
                    <tr><td>Demand ↑ AND Supply ↑</td><td><span className="key-term">? (Indeterminate)</span></td><td><span className="emphasis">↑ (Increase)</span></td></tr>
                    <tr><td>Demand ↑ AND Supply ↓</td><td><span className="emphasis">↑ (Increase)</span></td><td><span className="key-term">? (Indeterminate)</span></td></tr>
                    <tr><td>Demand ↓ AND Supply ↑</td><td><span className="emphasis-neg">↓ (Decrease)</span></td><td><span className="key-term">? (Indeterminate)</span></td></tr>
                    <tr><td>Demand ↓ AND Supply ↓</td><td><span className="key-term">? (Indeterminate)</span></td><td><span className="emphasis-neg">↓ (Decrease)</span></td></tr>
                 </tbody>
            </Table>

            {/* Role of Prices (Slides 26, 27) */}
            <h2>How Prices Allocate Resources – The Role of Prices</h2>
            <p>In market economies, prices are not just numbers; they act as essential <span className="concept">signals</span> that guide economic decisions and efficiently allocate scarce resources among producers and consumers.</p>
            <ul>
                <li><b>Balancing Supply and Demand:</b> For every good, prices naturally adjust to bring supply and demand into balance (towards equilibrium).</li>
                <li><b>Signaling Production & Consumption:</b>
                    <ul>
                        <li><span className="emphasis">High Prices</span> → Encourage producers to supply <span className="emphasis">more</span> & encourage consumers to buy <span className="emphasis-neg">less</span>.</li>
                        <li><span className="emphasis-neg">Low Prices</span> → Encourage consumers to buy <span className="emphasis">more</span> & encourage producers to supply <span className="emphasis-neg">less</span>.</li>
                    </ul>
                 </li>
                <li><b>Directing Investment:</b> Sustained high prices in a sector signal profitability, attracting <span className="emphasis">investment</span> and new firms, thus directing resources to where they are most demanded.</li>
                <li><b>Ensuring Efficiency:</b> The price mechanism helps ensure that resources flow towards producing goods that consumers value most highly, and that these goods are produced by those who can do so relatively efficiently (profitably).</li>
            </ul>

            <h3>How Equilibrium Price Guides Resource Allocation</h3>
            <p>The equilibrium price specifically determines:</p>
             <ul>
                 <li>✓ How much buyers ultimately purchase.</li>
                 <li>✓ How much sellers ultimately produce.</li>
                 <li>✓ How resources (labor, capital, materials) are allocated efficiently across the economy.</li>
             </ul>
            <p>It ensures producers make goods that can be sold profitably, encourages consumers to make choices based on their needs and budget constraints, and directs investment towards high-demand sectors.</p>
            <p className="interpretation"><b>Example (Cybersecurity Software - Slide 27):</b>
                <ol>
                    <li>Rising cyber threats increase demand for software → Demand shifts right → Prices rise.</li>
                    <li>Higher prices signal cybersecurity firms (like Norton, McAfee, CrowdStrike) that there's profit potential → They invest in R&D, hire experts, expand services → Supply increases (shifts right).</li>
                    <li>As more firms enter and supply catches up, competition increases → Prices stabilize towards a new, likely higher, equilibrium.</li>
                </ol>
                <b>Outcome:</b> Prices acted as signals to allocate more resources (programmers, analysts, servers) to cybersecurity, ensuring software is available to meet the demand without perpetual shortages or completely prohibitive pricing.
            </p>


            {/* Chapter Summary (Slide 28) */}
            <h2>Chapter Summary</h2>
            <p>In this chapter, we have:</p>
            <ul>
                <li>Discussed <span className="concept">market equilibrium</span> – how demand and supply interact to determine equilibrium price (P*) and quantity (Q*).</li>
                <li>Discussed <span className="concept">market disequilibrium</span> – the conditions of <span className="emphasis">Shortage</span> (Qd > Qs) and <span className="emphasis-neg">Surplus</span> (Qs > Qd) and how prices adjust.</li>
                <li>Reviewed the impact of <span className="important">shifts in demand</span> and <span className="important">shifts in supply</span> (individually and simultaneously) on the equilibrium price and quantity.</li>
                <li>Explored <span className="key-term">mathematical examples</span> (linear & non-linear) to determine equilibrium in specific markets (like IT markets).</li>
                <li>Analyzed the direction of changes in equilibrium when demand or supply increases or decreases.</li>
                <li>Examined how <span className="concept">prices allocate resources</span> efficiently in a market economy by acting as signals for production and consumption decisions.</li>
            </ul>

            {/* Next Topic (Slide 29) */}
            <h2>Next Topic</h2>
            <p>Our next focus will be: <span className="concept">Elasticity and its Applications</span> – measuring the responsiveness of quantity demanded and supplied to changes in price and other factors.</p>
        </div>
    );
}

export default LectureNotes;