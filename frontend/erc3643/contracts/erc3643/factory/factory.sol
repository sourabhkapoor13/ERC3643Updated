// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;
//import "@openzeppelin/contracts/access/Ownable.sol";
import "./factory1.sol";
import "./Ifactory.sol";

contract factory is Ifactory {
    struct Contracts {
        address tokenImplementation;
        address irImplementation;
        address mcImplementation;
        address irsImplementation;
        address ctrImplementation;
        address tirImplementation;
    }

    uint256 public salt;
    factory2 x = new factory2();
    address[] owners;

    mapping(address => mapping(uint256 => Contracts)) public alldata;
    mapping(address => uint256) ownertoken;

    function _deploy(uint256 _salt, bytes memory bytecode)
        private
        returns (address)
    {
        bytes32 saltBytes = bytes32(keccak256(abi.encodePacked(_salt)));
        address addr;

        assembly {
            let encoded_data := add(0x20, bytecode)
            let encoded_size := mload(bytecode)
            addr := create2(0, encoded_data, encoded_size, saltBytes)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        return addr;
    }

    function deployall(
        address _owner,
        string memory name,
        string memory symbol,
        uint256 decimal,
        address onchainId
    ) public returns (address) {
        address _owners = _owner;
        salt++;

        IClaimTopicsRegistry ctr = IClaimTopicsRegistry(
            x.claimtopicregistry(salt)
        );
        IClaimIssuersRegistry cir = IClaimIssuersRegistry(
            x.claimissuersregistry(salt)
        );

        IIdentityRegistryStorage irs = IIdentityRegistryStorage(
            x.identityregistrystorage(salt)
        );
        IIdentityRegistry ir = IIdentityRegistry(
            x.identityregistry(salt, address(cir), address(ctr), address(irs))
        );

        ICompliance mc = ICompliance(x.modularcompliance(salt));

        IToken it = IToken(
            tokens(
                salt,
                address(ir),
                address(mc),
                name,
                symbol,
                decimal,
                onchainId
            )
        );

        if (ownerexist(_owners)) {
            ownertoken[_owners]++;
            alldata[_owners][ownertoken[_owners]] = Contracts(
                address(it),
                address(ir),
                address(mc),
                address(irs),
                address(ctr),
                address(irs)
            );
        } else {
            ownertoken[_owners]++;
            alldata[_owners][ownertoken[_owners]] = Contracts(
                address(it),
                address(ir),
                address(mc),
                address(irs),
                address(ctr),
                address(irs)
            );
            owners.push(_owners);
        }

        Token(address(it)).grantRole(
            0x0000000000000000000000000000000000000000000000000000000000000000,
            _owners
        );
        x.grant_role(
            address(ir),
            address(irs),
            address(ctr),
            address(cir),
            address(this)
        );
        IdentityRegistry(address(ir)).grantRole(
            0x0000000000000000000000000000000000000000000000000000000000000000,
            _owners
        );
        IdentityRegistryStorage(address(irs)).bindIdentityRegistry(address(ir));

        (Ownable(address(it))).transferOwnership(_owners);

        //(Ownable(address(mc))).transferOwnership(_owners);
        //(Ownable(address(ir))).transferOwnership(_owners);
        (Ownable(address(ctr))).transferOwnership(_owners);
        (Ownable(address(cir))).transferOwnership(_owners);
        return address(it);
    }

    function ownerexist(address _owner) internal view returns (bool _owners) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == _owner) {
                return true;
            }
        }
    }

    function tokens(
        uint256 _salt,
        address _ir,
        address _mc,
        string memory _name,
        string memory _symbol,
        uint256 _decimal,
        address _onchainId
    ) internal returns (address) {
        bytes memory _code = type(Token).creationCode;
        bytes memory _constructData = abi.encode(
            _ir,
            _mc,
            _name,
            _symbol,
            _decimal,
            _onchainId
        );
        bytes memory bytecode = abi.encodePacked(_code, _constructData);
        return _deploy(_salt, bytecode);
    }
}
