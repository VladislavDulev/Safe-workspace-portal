import React, { useEffect, useState } from 'react';
import { Links } from '../common/links.enum';
import { Table } from 'react-bootstrap';


export default function Planning({ match }) {
    const [office, setOffice] = useState({})
    const [rowData, setRowData] = useState([]);
    const officeId = match.params.id;

    function nextDay(d, dow){
        //dow - day of week - [0, 6]
        const newDate = new Date(d);
        newDate.setDate(d.getDate() + (dow+(7-d.getDay())) % 7);
        return newDate;
    }

    useEffect(() => {
        fetch(`${Links.API}offices/${officeId}`)
            .then(r => r.json())
            .then(office => {
                if(office.error || office.statusCode) {
                    throw new Error(office);
                }
                setOffice(office);
                const allColumns = (office.deskPerCol * office.columns) + office.deskPerCol - 1;
                const allRows = (office.deskPerRow * office.rows) + office.deskPerRow - 1;
                let desksNumber = 0;       
                office.desks.sort((a,b) => {
                    return parseInt(a.id) < parseInt(b.id) ? -1 : 1;
                })
                const data = [];
                for(let i = 0; i < allRows; i++){
                    const row = {};
                    for(let k = 0; k < allColumns; k++) {
                        if((i + 1) % (office.rows + 1) === 0 && i !== 0) {
                            row[k] = `^${office.distanceBetweenRows}m^`;
                        }else{
                            if( (k + 1) % (office.columns + 1) === 0 && k !== 0) {
                                row[k] = `<-${office.distanceBetweenCols}m->`;
                            }else{
                                if(office.desks[desksNumber]?.isFree === 'Free') {
                                    let date = new Date();
                                    if(match.path.includes('later'))
                                        date = nextDay(date, 0);
                                    date.setHours(0, 0, 0, 0);
                                    const schedule = office.desks[desksNumber].pendingSchedules.find(e => new Date(e.dateStart) <= date && new Date(e.dateEnd)>= date);
                                    schedule ? row[k] = schedule.user.fullname : row[k] = 'Free';
                                }else {
                                    row[k] = `Desk ${desksNumber + 1}`;
                                }
                                desksNumber++
                            }
                        }
                    }
                    data.push(row);
                }
                setRowData(data);
            }).catch(e => console.log(e));
    }, [setRowData])
    function getClasses(state) {
        if(state === 'Free') {
            return 'free';
        }
        if(state.includes('Desk')){
            return 'not-available'
        }
        if(state.includes('m')){
            return 'freespace';
        }
        return 'taken';
    }
    const getTd = (obj) => {
        return Object.keys(obj).map((k => <td key={`key-${k}-value-${obj[k]}`} className={getClasses(obj[k])}>{obj[k]}</td>))
    }

    return (
        <div style={{overflowX: 'auto', width: '95vw'}}>
            <h1 className="planning-title">{office?.name} {match.path.includes('later') ? 'Next' : 'Current'} Week Planning</h1>
            <Table>
                <tbody>
                    {rowData.map((e, i) => <tr key={`tr-${i}`}>{getTd(e)}</tr>)}
                </tbody>
            </Table>
        </div>
    );
}