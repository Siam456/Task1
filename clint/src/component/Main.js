import React, { useState, useEffect } from 'react';
import './main.css'
import axios from 'axios'

const Main = () => {
    const [obj, setobj] = useState({
        value: 0,
        ExchangeRate: 0,
        productID: null, 
        insurance: 0.00,
        Charge: 0.00,
        totalValue: 0.00,
        AV: 0.00,
    });

    const [ product, setproduct] = useState({
        productID: 0,
        despription: "",
        CD: 0,
        SD: 0,
        VAT: 0,
        RD: 0,
        CDTK: 0,
        SDTK: 0,
        VATTK: 0,
        RDTK: 0,
        total: 0,
    })

    useEffect(() => {
        //console.log('axios')
        if(obj.value !== 0 
            && obj.ExchangeRate !== 0
            && obj.productID !== null ){
                //console.log(obj + ''); 
                axios.get(`/api/${obj.productID}`)
                .then(res => {
                    console.log(res)
                    setproduct({
                        productID: res.data.products[0].productID,
                        despription: res.data.products[0].despription,
                        CD: res.data.products[0].CD,
                        SD: res.data.products[0].SD,
                        VAT: res.data.products[0].VAT,
                        RD: res.data.products[0].RD,
                        CDTK: (obj.AV * res.data.products[0].CD/100).toFixed(2),
                        SDTK: ((obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100) * res.data.products[0].SD/100).toFixed(2),
                        VATTK: ((obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100 + (obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100) * res.data.products[0].SD/100) * res.data.products[0].VAT/100).toFixed(2),
                        RDTK: (obj.AV * res.data.products[0].RD/100).toFixed(2),
                        total: ((obj.AV * res.data.products[0].CD/100) + ((obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100) * res.data.products[0].SD/100) + ((obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100 + (obj.AV + res.data.products[0].CD/100 + res.data.products[0].RD/100) * res.data.products[0].SD/100) * res.data.products[0].VAT/100) + obj.AV * res.data.products[0].RD/100 + obj.AV).toFixed(2),
                    })
                })
                .catch(err => console.log(err));
        }
        
    }, [`/api/${obj.productID}`])

    //set value 
    const setValue = (e) => {
        const { name, value } = e.target;
        const x = Number(value);
        
        //console.log(value)
        if(name === 'value'){
            const total = x + x * 1/100 + x * 1/100;
            //console.log(typeof(x))
            setobj((prev) => {
                return({
                    value: x,
                    ExchangeRate: prev.ExchangeRate,
                    productID: prev.productID, 
                    insurance: (x * 1/100).toFixed(2),
                    Charge:  (x * 1/100).toFixed(2),
                    totalValue: total.toFixed(2),
                    AV: prev.ExchangeRate * x,
                })
            })
        } else if(name === 'exchangeRate'){
            setobj((prev) => {
                return({
                    value: prev.value,
                    ExchangeRate: value,
                    productID: prev.productID, 
                    insurance: prev.insurance,
                    Charge:  prev.Charge,
                    totalValue: prev.totalValue,
                    AV: prev.totalValue * x,
                })
            })
        } else if(name === 'productID'){
            setobj((prev) => {
                return({
                    value: prev.value,
                    ExchangeRate: prev.ExchangeRate,
                    productID: value, 
                    insurance: prev.insurance,
                    Charge:  prev.Charge,
                    totalValue: prev.totalValue,
                    AV: prev.AV,
                })
            })
        }
    }

    //change CD RD SD VAT value
    const changeData = (e) => {
        const { value, name } = e.target;
        
        
        if(name === 'cd'){
            if(value.includes('%')){
                const index = value.indexOf("%");
                const str1 = value.slice(0,index);
                const str2 = value.slice(index+1, value.length);
                const newValue = Number(str1+str2);
                //alert(newValue)
                setproduct((prev) => {
                    const cd = obj.AV * (newValue / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (newValue / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (newValue / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: newValue,
                        SD: prev.SD,
                        VAT: prev.VAT,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            } else{
                const newValue = Number(value);
                setproduct((prev) => {
                   
                    const cd = obj.AV * (newValue / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (newValue / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (newValue / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: newValue,
                        SD: prev.SD,
                        VAT: prev.VAT,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            }
        } else if(name === 'rd'){
            if(value.includes('%')){
                const index = value.indexOf("%");
                const str1 = value.slice(0,index);
                const str2 = value.slice(index+1, value.length);
                const newValue = Number(str1+str2);
                //alert(newValue)
                setproduct((prev) => {
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (newValue / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (newValue / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (newValue / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: prev.SD,
                        VAT: prev.VAT,
                        RD: newValue,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            } else{
                const newValue = Number(value);
                setproduct((prev) => {
                   
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (newValue / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (newValue / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (newValue / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: prev.SD,
                        VAT: prev.VAT,
                        RD: newValue,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            }
        } else if(name === 'sd'){
            if(value.includes('%')){
                const index = value.indexOf("%");
                const str1 = value.slice(0,index);
                const str2 = value.slice(index+1, value.length);
                const newValue = Number(str1+str2);
                //alert(newValue)
                setproduct((prev) => {
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (newValue / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (newValue / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: newValue,
                        VAT: prev.VAT,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            } else{
                const newValue = Number(value);
                setproduct((prev) => {
                   
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (newValue / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (newValue / 100))) * (obj.AV * (prev.VAT / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: newValue,
                        VAT: prev.VAT,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            }
        }  else if(name === 'vat'){
            if(value.includes('%')){
                const index = value.indexOf("%");
                const str1 = value.slice(0,index);
                const str2 = value.slice(index+1, value.length);
                const newValue = Number(str1+str2);
                //alert(newValue)
                setproduct((prev) => {
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (newValue / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: prev.SD,
                        VAT: newValue,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            } else{
                const newValue = Number(value);
                setproduct((prev) => {
                   
                    const cd = obj.AV * (prev.CD / 100);
                    const rd = obj.AV * (prev.RD / 100);
                    const sd = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100))) * (obj.AV * (prev.SD / 100));
                    const vat = (obj.AV + (obj.AV * (prev.CD / 100)) +(obj.AV * (prev.RD / 100)) + (obj.AV * (prev.SD / 100))) * (obj.AV * (newValue / 100));
                    const total = cd + rd + sd + vat;
                    //console.log(product.SDTK)
                    return({
                        productID: prev.productID,
                        despription: prev.despription,
                        CD: prev.CD,
                        SD: prev.SD,
                        VAT: newValue,
                        RD: prev.RD,
                        CDTK: (cd).toFixed(2),
                        SDTK: sd.toFixed(2),
                        VATTK: vat.toFixed(2), 
                        RDTK: rd.toFixed(2),
                        total: (total).toFixed(2),
                        
                    })
                })
            }
        }

        //console.log(typeof(obj.AV));
    }
    return (
        <div id='mainSection'>
            <form>
                <div className="grid-container">
                    <div className="grid-item">
                        <div className='flexAndSpaceBetween'>
                            <span>Value($)</span>
                            <input onChange={setValue} type='number' name='value' value={obj.value === 0 ? '' : obj.value} />
                        </div>
                    </div>
                    <div className="grid-item">
                        <div className='flexAndSpaceBetween' style={{marginBottom: '10px'}}>
                            <span>Exchange Rate </span>
                            <input name='exchangeRate'  onChange={setValue} type='number'  value={obj.ExchangeRate === 0 ? '' : obj.ExchangeRate} />
                        </div> 
                        <div className='flexAndSpaceBetween'>
                            <span>Product ID </span>
                            <input  onChange={setValue} type='number' name='productID'/>
                        </div>
                        
                    </div>  
                    <div style={{display: 'block'}}>
                        <div className='insuranceAndChargeWrapper'>
                            <div className='flexAndSpaceBetween'>
                                <span>Insurance 1%</span>
                                <span>{obj.insurance=== 0 ? obj.insurance+'.00':obj.insurance}USD</span>
                            </div>
                            <div className='flexAndSpaceBetween'>
                                <span>Charge 1%</span>
                                <span>{obj.Charge=== 0 ? obj.Charge+'.00':obj.Charge}USD</span>
                            </div>     
                        </div> 
                        <div>
                            <div className='flexAndSpaceBetween'>
                                <span>Total Value</span>
                                <span>{obj.totalValue=== 0 ? obj.totalValue+'.00':obj.totalValue}USD</span>
                            </div> 
                        </div> 
                        
                        <br/>
                        <div className='insuranceAndChargeWrapper'>
                            <div className='flexAndSpaceBetween'>
                                <span>A/V</span>
                                <input style={{textAlign: 'right'}} value={`${obj.AV===0 ? obj.AV+'.00' : (obj.AV).toFixed(2)}TK`}/>
                            </div> 
                            <div className='flexAndSpaceBetween'>
                                <div>
                                    <span>CD</span>
                                    <input onChange={changeData} name='cd' style={{textAlign: 'center'}} value={`${product.CD}%`} id='cdid' className='sinput' />
                                </div>
                                <input style={{textAlign: 'right'}} value={`${product.CDTK===0 ? product.CDTK+'.00' : product.CDTK}TK`} />
                            </div>
                            <div className='flexAndSpaceBetween'>
                                <div>
                                    <span>RD</span>
                                    <input onChange={changeData} name='rd' style={{textAlign: 'center'}} value={`${product.RD}%`} className='sinput' />
                                </div>
                                <input style={{textAlign: 'right'}} value={`${product.RDTK===0 ? product.RDTK+'.00' : product.RDTK}TK`} />
                            </div>
                            <div className='flexAndSpaceBetween'>
                                <div>
                                    <span>SD</span>
                                    <input onChange={changeData} name='sd' style={{textAlign: 'center'}} value={`${product.SD}%`} className='sinput' />
                                </div>
                                <input style={{textAlign: 'right'}} value={`${product.SDTK===0 ? product.SDTK+'.00' : product.SDTK}TK`} />
                            </div>
                            <div className='flexAndSpaceBetween'>
                                <div>
                                    <span>VAT</span>
                                    <input onChange={changeData} name='vat' style={{textAlign: 'center', marginLeft: '22px'}} value={`${product.VAT}%`} className='sinput' />
                                </div>
                                <input style={{textAlign: 'right'}} value={`${product.VATTK===0 ? product.VATTK+'.00' : product.VATTK}TK`} />
                            </div>
                        </div>

                        <div>
                            <div className='flexAndSpaceBetween'>
                                <span>Total</span>
                                <span>{product.total=== 0 ? product.total+'.00':product.total}TK</span>
                            </div> 
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default Main;