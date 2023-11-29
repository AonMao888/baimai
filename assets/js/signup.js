var toastdiv = document.querySelector(".toastdiv");
        function toast(text){
            toastdiv.innerHTML = text;
            toastdiv.style.left = 0;
            toastdiv.style.bottom = 0;
            setTimeout(()=>{
                toastdiv.style.left = '-10vh';
                toastdiv.style.bottom = '-10vh';
                toastdiv.innerHTML = '';
            },3000)
        }
        function start(){
            document.querySelector(".start").style.display = 'none';
            document.querySelector(".namediv").style.display = 'flex';
        }
        function inname(){
            if(document.querySelector('.uname').value.length > 2){
                document.querySelector(".namediv").style.display = 'none';
                document.querySelector(".birthdiv").style.display = 'flex';
                document.querySelector('.fname').value = document.querySelector('.uname').value;
            }else{
                toast('Your name must have minimum 3 words!')
            }
        }
        function inbirth(){
            if(document.querySelector('.ubirth').value){
                document.querySelector(".birthdiv").style.display = 'none';
                document.querySelector(".genderdiv").style.display = 'flex';
                document.querySelector('.fbirth').value = document.querySelector('.ubirth').value;
            }else{
                toast('Please choose birth date!')
            }
        }
        function ingender(){
            if(document.querySelector(".gender").value == 'gender'){
                toast('Please choose gender!');
            }else{
                document.querySelector(".genderdiv").style.display = 'none';
                document.querySelector(".emaildiv").style.display = 'flex';
                document.querySelector('.fgender').value = document.querySelector('.gender').value;
            }
        }
        function inemail(){
            if(document.querySelector(".uemail").value.length > 10 && document.querySelector(".uemail").value.includes('@gmail.com')){
                document.querySelector(".emaildiv").style.display = 'none';
                document.querySelector(".passdiv").style.display = 'flex';
                document.querySelector(".femail").value = document.querySelector(".uemail").value;
            }else{
                toast('Please set email!')
            }
        }
        function inpass(){
            if(document.querySelector(".upass").value.length > 4){
                if(document.querySelector(".conpass").value == document.querySelector(".upass").value){
                    document.querySelector(".fpass").value = document.querySelector(".upass").value;
                    document.querySelector('.fbtn').click();
                }else{
                    toast(`Passowrd doesn't match!`)
                }
            }else{
                toast('Password must have minimum 5 words!')
            }
        }
        function backtoname(){
            document.querySelector(".namediv").style.display = 'flex';
            document.querySelector(".birthdiv").style.display = 'none';
        }
        function backtobirth(){
            document.querySelector(".birthdiv").style.display = 'flex';
            document.querySelector(".genderdiv").style.display = 'none';
        }
        function backtogender(){
            document.querySelector(".genderdiv").style.display = 'flex';
            document.querySelector(".emaildiv").style.display = 'none';
        }
        function backtoemail(){
            document.querySelector(".emaildiv").style.display = 'flex';
            document.querySelector(".passdiv").style.display = 'none';
        }