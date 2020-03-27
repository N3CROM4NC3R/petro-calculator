class Calculator{
    constructor(){
        this.url = 'https://petroapp-price.petro.gob.ve/price/';
        this.calculate = this.calculate.bind(this);
        this.validate = this.validate.bind(this);
        this.inputs = {
            'petro':document.getElementById('petroInput'),
            'dollar':document.getElementById('dollarInput'),
            'ruble':document.getElementById('rubleInput'),
            'sovereign':document.getElementById('sovereignInput'),
        }
        this.subTitle = document.getElementById('calculator-subTitle');
        this.validCharacters = ['0','1','2','3','4','5','5','6','7','8','.','Backspace','ArrowUp','ArrowDown','ArrowRight','ArrowLeft'];
        this.initialitate();
    }

    async initialitate(){
        this.subTitleChanging();
        this.desactivateInputs()
        await this.api();
        this.activateInputs()
        this.addEventKeyDownAll();
        this.addEventKeyUpAll();
    }
    async sleep(delay){
        return new Promise(resolve=>{
            setTimeout(resolve,delay);
        })
    }
    async subTitleChanging(){
        while(true){
            for(let i=0;i<3;i++){
                await this.sleep(1000).then(this.changeSubTitleChanging(i));
                if(this.prices){
                    this.subTitle.innerHTML="Ingrese su monto";
                    return 0;
                }
            }
        }
    }
    checkInput(character,key){
        return character == key;
    }
    changeSubTitleChanging(i){

        switch(i){

            case 0:
                this.subTitle.innerHTML="Cargando.";
                break;
            case 1:
                this.subTitle.innerHTML="Cargando..";
                break;
            case 2:
                this.subTitle.innerHTML="Cargando...";
                break;

        }

    }
    desactivateInputs(){
        this.inputs.petro.disabled = true;
        this.inputs.dollar.disabled = true;
        this.inputs.ruble.disabled = true;
        this.inputs.sovereign.disabled = true;
    }
    activateInputs(){
        this.inputs.petro.disabled = false;
        this.inputs.dollar.disabled = false;
        this.inputs.ruble.disabled = false;
        this.inputs.sovereign.disabled = false;
    }
    async api(){
        let data = {
            "coins": [
                "PTR"
            ],
            "fiats": [
                "USD",
                "RUB",
                "BS"
              ]
        };
        let options = {
            method:'POST',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data),
        };
        await fetch(this.url,options)
          .then(data=>data.json())
          .catch(error=>this.showError(error))
          .then(data=>this.takePricesApi(data));

    }
    addEventKeyDownAll(){
        this.addEventKeyDown(this.inputs.petro);
        this.addEventKeyDown(this.inputs.sovereign);
        this.addEventKeyDown(this.inputs.ruble);
        this.addEventKeyDown(this.inputs.dollar);
    }
    addEventKeyDown(input){
        input.addEventListener('keydown',this.validate);
    }
    addEventKeyUpAll(){

        this.addEventKeyUp(this.inputs.petro);
        this.addEventKeyUp(this.inputs.sovereign);
        this.addEventKeyUp(this.inputs.ruble);
        this.addEventKeyUp(this.inputs.dollar);

    }
    addEventKeyUp(input){
        input.addEventListener('keyup',this.calculate);
    }
    takePricesApi(data){
        this.prices = data.data.PTR;
    }
    validate(e){
        if(!(this.validCharacters.some((character)=>this.checkInput(character,e.key)))){
            e.preventDefault();
        }
    }
    showError(error){
        console.log(error);
    }
    change(e){
        // this.validate.then(
        //     e=>this.calculate(e)
        // ).catch(
        //     error=>this.showErrorApi(error)
        // );
        this.calculate(e);
    }
    calculate(e){
        // this.validate(e);
        if(!(e.target.id === 'petroInput')){

            let price = this.givePrice(e.target.id);
            let value = e.target.value;
            this.inputs.petro.value = value/price;

        }
        this.putPrices(this.inputs.sovereign,e);
        this.putPrices(this.inputs.ruble,e);
        this.putPrices(this.inputs.dollar,e);

    }
    // validate(e){
    //     if(codeCha)
    //
    // }
    putPrices(input,e){
        if (e.target.id != input.id && input.id != 'petroInput'){
            let price = this.givePrice(input.id);
            let petroValue = this.inputs.petro.value;
            input.value = price*petroValue;

        }
    }
    givePrice(money){
        switch(money){
            case "dollarInput":
                return this.prices.USD;
            case 'sovereignInput':
                return this.prices.BS;
            case 'rubleInput':
                return this.prices.RUB;
            default:
                throw 'Money invalid error';
                break;
        }
    }
}

window.calculator = new Calculator()
console.log("Hola");
